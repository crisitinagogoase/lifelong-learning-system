package com.learning.controller;

import com.learning.model.UserProfile;
import com.learning.model.UserSkill;
import com.learning.repository.UserProfileRepository;
import com.learning.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserProfileRepository profileRepository;

    @Autowired
    private UserSkillRepository skillRepository;

    @Autowired
    private com.learning.service.SessionService sessionService;

    private Integer getUserIdFromSession(String sessionId) {
        if (sessionId == null) return null;
        var session = sessionService.getSession(sessionId);
        return session != null ? session.getUserId() : null;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        Map<String, Object> response = new HashMap<>();
        
        profileRepository.findByUserId(userId).ifPresent(profile -> {
            response.put("profile", profile);
        });
        
        List<UserSkill> skills = skillRepository.findByUserId(userId);
        response.put("skills", skills);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                           @RequestBody UserProfile profile) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        profile.setUserId(userId);
        profileRepository.save(profile);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addSkill(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                     @RequestBody UserSkill skill) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        skill.setUserId(userId);
        skillRepository.save(skill);
        return ResponseEntity.ok(Map.of("message", "Skill added successfully"));
    }

    @DeleteMapping("/skills/{skillName}")
    public ResponseEntity<?> removeSkill(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                       @PathVariable String skillName) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        skillRepository.deleteByUserIdAndSkillName(userId, skillName);
        return ResponseEntity.ok(Map.of("message", "Skill removed successfully"));
    }

    @PutMapping("/skills")
    public ResponseEntity<?> updateSkill(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                        @RequestBody UserSkill skill) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        skill.setUserId(userId);
        skillRepository.update(skill);
        return ResponseEntity.ok(Map.of("message", "Skill updated successfully"));
    }
}
