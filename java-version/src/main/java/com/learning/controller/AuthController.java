package com.learning.controller;

import com.learning.model.User;
import com.learning.service.AuthService;
import com.learning.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private SessionService sessionService;

    // Înregistrare utilizator nou
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request.getName(), request.getEmail(), request.getPassword());
            
            // Create session
            String sessionId = sessionService.createSession(user.getId(), user.getEmail(), user.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
            ));
            response.put("sessionId", sessionId);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Autentificare utilizator
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request.getEmail(), request.getPassword());
            
            // Create session
            String sessionId = sessionService.createSession(user.getId(), user.getEmail(), user.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
            ));
            response.put("sessionId", sessionId);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Get current session
    @GetMapping("/session")
    public ResponseEntity<?> getSession(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        if (sessionId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No session"));
        }
        
        var session = sessionService.getSession(sessionId);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired session"));
        }
        
        return ResponseEntity.ok(Map.of(
            "userId", session.getUserId(),
            "email", session.getEmail(),
            "name", session.getName()
        ));
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        if (sessionId != null) {
            sessionService.invalidateSession(sessionId);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // Clase interne pentru request-uri
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
