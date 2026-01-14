package com.learning.controller;

import com.learning.model.Recommendation;
import com.learning.service.RecommendationService;
import com.learning.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<?> getRecommendations(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        if (sessionId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        var session = sessionService.getSession(sessionId);
        if (session == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid session"));
        }
        
        Recommendation recommendations = recommendationService.generateRecommendations(session.getUserId());
        return ResponseEntity.ok(recommendations);
    }
}
