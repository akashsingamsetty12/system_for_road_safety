package com.example.backend.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.Pothole;
import com.example.backend.repository.PotholeRepository;
import com.example.backend.service.VideoDetectionService;
import com.example.backend.service.YoloDetectionService;

@RestController
@RequestMapping("/potholes")
@CrossOrigin(origins = "*")
public class PotholeController {

    @Autowired
    private PotholeRepository repo;

    @Autowired
    private YoloDetectionService yoloDetectionService;

    @Autowired
    private VideoDetectionService videoDetectionService;

    @PostMapping
    public Pothole save(@RequestBody Pothole pothole) {
        // Set timestamp if not provided
        if (pothole.getTimestamp() == null) {
            pothole.setTimestamp(System.currentTimeMillis());
        }
        System.out.println("💾 Saving pothole: lat=" + pothole.getLatitude() + ", lng=" + pothole.getLongitude());
        return repo.save(pothole);
    }

    @GetMapping
    public List<Pothole> getAll() {
        List<Pothole> potholes = repo.findAll();
        // If database is empty, return hardcoded locations
        if (potholes == null || potholes.isEmpty()) {
            return getKarnatakaPotholeLocations();
        }
        return potholes;
    }

    @GetMapping("/locations")
    public List<Pothole> getKarnatakaPotholeLocations() {
        List<Pothole> locations = new java.util.ArrayList<>();
        String[] areaNames = {
            "Downtown District", "Highway Zone", "Suburbs", "Market Street", "Park Avenue",
            "Main Street", "Broadway", "Central Park", "Fifth Avenue", "Wall Street",
            "Bengaluru Road", "Whitefield Area", "Koramangala", "Indiranagar", "Vijaynagar",
            "Mysore Road", "Bannerghatta", "Electronic City", "Bellandur", "Sarjapur"
        };

        double minLat = 12.5;
        double maxLat = 18.0;
        double minLng = 74.5;
        double maxLng = 78.5;

        for (int i = 0; i < 100; i++) {
            Pothole pothole = new Pothole();
            pothole.setId("demo_" + i);
            double latitude = minLat + Math.random() * (maxLat - minLat);
            double longitude = minLng + Math.random() * (maxLng - minLng);
            pothole.setLatitude(latitude);
            pothole.setLongitude(longitude);

            int issues = (int)(Math.random() * 100) + 1;
            pothole.setIssues(issues);

            String severity = issues > 60 ? "Critical" : issues > 35 ? "High" : issues > 15 ? "Medium" : "Low";
            pothole.setSeverity(severity);

            pothole.setArea(areaNames[i % areaNames.length] + " Zone " + (i + 1));
            pothole.setLocation(areaNames[i % areaNames.length]);
            pothole.setTimestamp(System.currentTimeMillis() - (long)(Math.random() * 86400000)); // Random time in last 24 hours

            locations.add(pothole);
        }

        return locations;
    }

    @PostMapping("/detect")
    public ResponseEntity<Map<String, Object>> detect(@RequestParam("file") MultipartFile file,
                                                       @RequestParam(value = "latitude", required = false) Double latitude,
                                                       @RequestParam(value = "longitude", required = false) Double longitude) throws IOException {
        Map<String, Object> result = yoloDetectionService.detectImage(file);
        
        // Add location and timestamp to result if provided
        if (latitude != null && longitude != null) {
            result.put("latitude", latitude);
            result.put("longitude", longitude);
            result.put("timestamp", System.currentTimeMillis());
            System.out.println("📍 Detection at location: " + latitude + ", " + longitude);
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/detect-video")
    public ResponseEntity<Map<String, Object>> detectVideo(@RequestParam("file") MultipartFile file,
                                                           @RequestParam(value = "latitude", required = false) Double latitude,
                                                           @RequestParam(value = "longitude", required = false) Double longitude) throws IOException {
        try {
            String processedVideoPath = videoDetectionService.processVideo(file);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            // Return video path - frontend will construct full URL with API_BASE_URL
            response.put("videoUrl", "/potholes/get-video?path=" +
                        java.net.URLEncoder.encode(processedVideoPath, "UTF-8"));
            response.put("videoPath", processedVideoPath);
            response.put("message", "Video processed successfully");
            
            // Add location and timestamp to result if provided
            if (latitude != null && longitude != null) {
                response.put("latitude", latitude);
                response.put("longitude", longitude);
                response.put("timestamp", System.currentTimeMillis());
                System.out.println("📍 Video detection at location: " + latitude + ", " + longitude);
            }
            
            // Cleanup old files
            videoDetectionService.cleanupOldFiles();
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Video processing failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/get-video")
    public ResponseEntity<byte[]> getProcessedVideo(@RequestParam("path") String filePath) throws IOException {
        try {
            System.out.println("📹 GET /get-video called with path: " + filePath);
            byte[] videoBytes = videoDetectionService.getVideoFile(filePath);
            System.out.println("✅ Video file loaded, size: " + videoBytes.length + " bytes");
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"processed_video.mp4\"")
                    .contentType(MediaType.valueOf("video/mp4"))
                    .body(videoBytes);
        } catch (IOException e) {
            System.err.println("❌ Error loading video: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new byte[0]);
        }
    }

}

