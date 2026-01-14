package com.learning.repository;

import com.learning.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class CourseRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper pentru Course
    private static class CourseRowMapper implements RowMapper<Course> {
        @Override
        public Course mapRow(ResultSet rs, int rowNum) throws SQLException {
            Course course = new Course();
            course.setId(rs.getInt("id"));
            course.setTitle(rs.getString("title"));
            course.setDescription(rs.getString("description"));
            course.setProvider(rs.getString("provider"));
            course.setLevel(rs.getString("level"));
            course.setDuration(rs.getString("duration"));
            course.setUrl(rs.getString("url"));
            course.setMarketRelevance(rs.getBigDecimal("market_relevance"));
            if (rs.getTimestamp("created_at") != null) {
                course.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }
            return course;
        }
    }

    // Găsește curs după ID
    public Optional<Course> findById(Integer id) {
        String sql = "SELECT * FROM courses WHERE id = ?";
        try {
            Course course = jdbcTemplate.queryForObject(sql, new CourseRowMapper(), id);
            return Optional.ofNullable(course);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Listă toate cursurile
    public List<Course> findAll() {
        String sql = "SELECT * FROM courses ORDER BY market_relevance DESC, title ASC";
        return jdbcTemplate.query(sql, new CourseRowMapper());
    }

    // Găsește cursuri după nivel
    public List<Course> findByLevel(String level) {
        String sql = "SELECT * FROM courses WHERE level = ? ORDER BY market_relevance DESC";
        return jdbcTemplate.query(sql, new CourseRowMapper(), level);
    }

    // Găsește cursuri recomandate pentru un utilizator (bazate pe competențe)
    public List<Course> findRecommendedForUser(Integer userId) {
        String sql = """
            SELECT DISTINCT c.id, c.title, c.description, c.provider, c.level, 
                   c.duration, c.url, c.market_relevance, c.created_at
            FROM courses c
            JOIN course_skills cs ON c.id = cs.course_id
            JOIN user_skills us ON cs.skill_name = us.skill_name
            WHERE us.user_id = ?
              AND c.id NOT IN (
                  SELECT course_id FROM course_enrollments WHERE user_id = ?
              )
            ORDER BY c.market_relevance DESC
            LIMIT 10
            """;
        return jdbcTemplate.query(sql, new CourseRowMapper(), userId, userId);
    }

    // Creează curs nou
    public Course save(Course course) {
        String sql = """
            INSERT INTO courses (title, description, provider, level, duration, url, market_relevance, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            RETURNING id, created_at
            """;
        
        return jdbcTemplate.queryForObject(sql, new CourseRowMapper(),
            course.getTitle(),
            course.getDescription(),
            course.getProvider(),
            course.getLevel(),
            course.getDuration(),
            course.getUrl(),
            course.getMarketRelevance() != null ? course.getMarketRelevance() : new BigDecimal("0.80")
        );
    }

    // Obține skill-urile unui curs
    public List<String> getCourseSkills(Integer courseId) {
        String sql = "SELECT skill_name FROM course_skills WHERE course_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("skill_name"), courseId);
    }
}
