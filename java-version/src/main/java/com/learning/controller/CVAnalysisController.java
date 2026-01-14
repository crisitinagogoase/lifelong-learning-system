package com.learning.controller;

import com.learning.model.CVAnalysisResult;
import com.learning.service.CVAnalysisService;
import com.learning.service.RecommendationService;
import com.learning.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cv-analysis")
@CrossOrigin(origins = "*")
public class CVAnalysisController {

    @Autowired
    private CVAnalysisService cvAnalysisService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<?> analyzeCV(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                        @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
            }

            CVAnalysisResult cvData = cvAnalysisService.analyzeCV(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("cvData", cvData);
            response.put("message", "CV analyzed successfully");
            
            // Generate recommendations if user is logged in
            if (sessionId != null) {
                var session = sessionService.getSession(sessionId);
                if (session != null) {
                    // TODO: Save extracted skills to user profile
                    response.put("recommendations", recommendationService.generateRecommendations(session.getUserId()));
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
