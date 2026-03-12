package com.example.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
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

import com.example.backend.model.Location;
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
        return repo.save(pothole);
    }

    @GetMapping
    public List<Pothole> getAll() {
        return repo.findAll();
    }

    @PostMapping("/detect")
    public ResponseEntity<Map<String, Object>> detect(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(yoloDetectionService.detectImage(file));
    }

    @PostMapping("/detect-video")
    public ResponseEntity<Map<String, Object>> detectVideo(@RequestParam("file") MultipartFile file) throws IOException {
        try {
            String processedVideoPath = videoDetectionService.processVideo(file);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            // Return video path - frontend will construct full URL with API_BASE_URL
            response.put("videoUrl", "/potholes/get-video?path=" +
                        java.net.URLEncoder.encode(processedVideoPath, "UTF-8"));
            response.put("videoPath", processedVideoPath);
            response.put("message", "Video processed successfully");
            
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

    @GetMapping("/locations")
    public List<Location> getRandomLocations() {
        return generateRandomLocations();
    }

    private List<Location> generateRandomLocations() {
        String[] areaNames = {
            "Downtown District", "Highway Zone", "Suburbs", "Market Street", "Park Avenue",
            "Main Street", "Broadway", "Central Park", "Fifth Avenue", "Wall Street",
            "Times Square", "Brooklyn Heights", "Queens", "Harlem", "Upper East Side",
            "Lower East Side", "West Village", "Chelsea", "Midtown", "Financial District",
            "SoHo", "TriBeCa", "Chinatown", "Little Italy", "Nolita",
            "East Village", "NoHo", "Gramercy", "Flatiron", "Murray Hill",
            "Kips Bay", "Stuyvesant Town", "Astoria", "Long Island City", "Williamsburg",
            "Greenpoint", "Bushwick", "Bed-Stuy", "Crown Heights", "Park Slope",
            "Prospect Heights", "Washington Heights", "Inwood", "Jackson Heights", "Bayside"
        };
        
        String[] roadTypes = {"State Highway", "City Street", "Main Road", "Local Road", "Express Way", "Arterial Road"};
        String[] statuses = {"Open", "Under Repair", "Monitoring", "Closed", "Pending"};

        List<Location> locations = new ArrayList<>();
        double baseLat = 17.385044;
        double baseLng = 78.486671;

        for (int i = 0; i < 100; i++) {
            double lat = baseLat + (Math.random() - 0.5) * 0.3;
            double lng = baseLng + (Math.random() - 0.5) * 0.3;
            int issues = (int) (Math.random() * 80) + 5;
            String areaName = areaNames[(int) (Math.random() * areaNames.length)];
            String roadType = roadTypes[(int) (Math.random() * roadTypes.length)];
            String status = statuses[(int) (Math.random() * statuses.length)];
            int potholes = (int) (Math.random() * 20) + 1;
            int cracks = (int) (Math.random() * 30) + 1;
            String severity = issues > 50 ? "Critical" : issues > 25 ? "High" : "Moderate";
            
            locations.add(new Location(
                i + 1,
                areaName + " - Sector " + (char)(65 + (i % 26)),
                issues,
                String.format("%.6f", lat),
                String.format("%.6f", lng),
                severity,
                roadType,
                potholes,
                cracks,
                status
            ));
        }

        return locations;
    }
}

