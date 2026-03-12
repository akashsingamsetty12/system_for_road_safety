package com.example.backend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VideoDetectionService {

    @Value("${python.script.path:../model/process_video.py}")
    private String pythonScriptPath;

    @Value("${python.executable:python}")
    private String pythonExecutable;

    @Value("${video.temp.dir:/tmp/video_processing}")
    private String tempDir;

    /**
     * Process video file using Python script
     * @param file Video file to process
     * @return Path to processed video file
     * @throws IOException if processing fails
     */
    public String processVideo(MultipartFile file) throws IOException {
        try {
            // Create temp directory if not exists
            Path tempPath = Paths.get(tempDir);
            Files.createDirectories(tempPath);

            // Save input video
            String inputFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path inputPath = tempPath.resolve(inputFileName);
            Files.write(inputPath, file.getBytes());

            // Prepare output path
            String outputFileName = System.currentTimeMillis() + "_processed_video.mp4";
            Path outputPath = tempPath.resolve(outputFileName);

            // Run Python script to process video
            ProcessBuilder pb = new ProcessBuilder(
                    pythonExecutable,
                    pythonScriptPath,
                    inputPath.toString(),
                    outputPath.toString()
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Capture output for debugging
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                System.out.println("Python: " + line);
                output.append(line).append("\n");
            }

            // Wait for process to complete (with timeout)
            boolean completed = process.waitFor(3600, java.util.concurrent.TimeUnit.SECONDS);
            
            if (!completed) {
                process.destroyForcibly();
                throw new IOException("Video processing timed out after 1 hour");
            }

            if (process.exitValue() != 0) {
                throw new IOException("Python script failed with exit code: " + process.exitValue() + 
                                    "\nOutput: " + output.toString());
            }

            if (!Files.exists(outputPath)) {
                throw new IOException("Processed video file was not created");
            }

            // Return path relative to application
            return outputPath.toAbsolutePath().toString();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Video processing was interrupted", e);
        }
    }

    /**
     * Get video file as byte array for streaming
     * @param filePath Path to video file
     * @return Video file bytes
     */
    public byte[] getVideoFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IOException("Video file not found: " + filePath);
        }
        return Files.readAllBytes(path);
    }

    /**
     * Cleanup old video files
     */
    public void cleanupOldFiles() {
        try {
            Path tempPath = Paths.get(tempDir);
            if (!Files.exists(tempPath)) return;

            long oneHourAgo = System.currentTimeMillis() - 3600000; // 1 hour

            Files.list(tempPath)
                    .filter(path -> Files.isRegularFile(path))
                    .filter(path -> {
                        try {
                            long lastModified = Files.getLastModifiedTime(path).toMillis();
                            return lastModified < oneHourAgo;
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            System.out.println("Deleted old video file: " + path);
                        } catch (IOException e) {
                            System.err.println("Failed to delete file: " + path);
                        }
                    });
        } catch (IOException e) {
            System.err.println("Error during cleanup: " + e.getMessage());
        }
    }
}
