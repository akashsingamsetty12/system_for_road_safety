package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class YoloDetectionService {

    @Value("${yolo.api.url:http://localhost:5000/detect}")
    private String yoloApiUrl;
    
    @Autowired
    private RestTemplate restTemplate;

    /**
     * Send image to YOLO API for detection
     * @param file Image file to detect
     * @return Detection results with detections array and message
     * @throws IOException if image reading fails
     */
    public Map<String, Object> detectImage(MultipartFile file) throws IOException {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileAsResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            // Send request to YOLO API and get response as Map
            @SuppressWarnings("unchecked")
            ResponseEntity<LinkedHashMap<String, Object>> response = (ResponseEntity<LinkedHashMap<String, Object>>) 
                    (ResponseEntity<?>) restTemplate.postForEntity(
                    yoloApiUrl, 
                    requestEntity, 
                    LinkedHashMap.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return new HashMap<>(response.getBody());
            } else {
                // Return error response if API call fails
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("detections", new java.util.ArrayList<>());
                errorResponse.put("message", "Detection API returned error: " + response.getStatusCode());
                return errorResponse;
            }
        } catch (Exception e) {
            // Handle connection errors to YOLO API
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("detections", new java.util.ArrayList<>());
            errorResponse.put("message", "Error connecting to YOLO API: " + e.getMessage());
            return errorResponse;
        }
    }
}
