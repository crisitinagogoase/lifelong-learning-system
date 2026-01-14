package com.learning.controller;

import com.learning.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SessionService sessionService;

    private Integer getUserIdFromSession(String sessionId) {
        if (sessionId == null) return null;
        var session = sessionService.getSession(sessionId);
        return session != null ? session.getUserId() : null;
    }

    @PostMapping
    public ResponseEntity<?> enroll(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                   @RequestParam Integer courseId) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        String sql = """
            INSERT INTO course_enrollments (user_id, course_id, progress)
            VALUES (?, ?, 0)
            ON CONFLICT (user_id, course_id) DO NOTHING
            """;
        jdbcTemplate.update(sql, userId, courseId);
        return ResponseEntity.ok(Map.of("message", "Enrolled successfully"));
    }

    @GetMapping
    public ResponseEntity<?> getUserEnrollments(@RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        String sql = """
            SELECT ce.id, ce.course_id, ce.progress, ce.enrolled_at, ce.completed_at,
                   c.title, c.provider, c.level
            FROM course_enrollments ce
            JOIN courses c ON ce.course_id = c.id
            WHERE ce.user_id = ?
            ORDER BY ce.enrolled_at DESC
            """;
        
        List<Map<String, Object>> enrollments = jdbcTemplate.query(sql, 
            (rs, rowNum) -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", rs.getInt("id"));
                map.put("courseId", rs.getInt("course_id"));
                map.put("progress", rs.getInt("progress"));
                map.put("enrolledAt", rs.getTimestamp("enrolled_at"));
                map.put("completedAt", rs.getTimestamp("completed_at"));
                map.put("title", rs.getString("title"));
                map.put("provider", rs.getString("provider"));
                map.put("level", rs.getString("level"));
                return map;
            }, userId);
        
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{enrollmentId}/progress")
    public ResponseEntity<?> updateProgress(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                            @PathVariable Integer enrollmentId,
                                            @RequestParam Integer progress) {
        Integer userId = getUserIdFromSession(sessionId);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        String sql = """
            UPDATE course_enrollments 
            SET progress = ?,
                completed_at = CASE WHEN ? = 100 THEN CURRENT_TIMESTAMP ELSE NULL END
            WHERE id = ? AND user_id = ?
            """;
        jdbcTemplate.update(sql, progress, progress, enrollmentId, userId);
        return ResponseEntity.ok(Map.of("message", "Progress updated"));
    }
}
