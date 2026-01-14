package com.learning.model;

import java.time.LocalDateTime;

public class Session {
    private String sessionId;
    private Integer userId;
    private String email;
    private String name;
    private LocalDateTime expiresAt;

    public Session() {}

    public Session(String sessionId, Integer userId, String email, String name) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.expiresAt = LocalDateTime.now().plusHours(24);
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
