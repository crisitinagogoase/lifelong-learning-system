package com.learning.service;

import com.learning.model.Session;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public String createSession(Integer userId, String email, String name) {
        String sessionId = UUID.randomUUID().toString();
        Session session = new Session(sessionId, userId, email, name);
        sessions.put(sessionId, session);
        return sessionId;
    }

    public Session getSession(String sessionId) {
        Session session = sessions.get(sessionId);
        if (session != null && session.isExpired()) {
            sessions.remove(sessionId);
            return null;
        }
        return session;
    }

    public void invalidateSession(String sessionId) {
        sessions.remove(sessionId);
    }

    public void cleanupExpiredSessions() {
        sessions.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
}
