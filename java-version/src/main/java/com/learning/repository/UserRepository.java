package com.learning.repository;

import com.learning.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
//import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper pentru User
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            if (rs.getTimestamp("updated_at") != null) {
                user.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            return user;
        }
    }

    // Găsește utilizator după email
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, new UserRowMapper(), email);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Găsește utilizator după ID
    public Optional<User> findById(Integer id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Creează utilizator nou
    public User save(User user) {
        String sql = "INSERT INTO users (name, email, password, created_at, updated_at) " +
                     "VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) " +
                     "RETURNING id, created_at, updated_at";
        
        return jdbcTemplate.queryForObject(sql, new UserRowMapper(), 
            user.getName(), 
            user.getEmail(), 
            user.getPassword()
        );
    }

    // Actualizează utilizator
    public void update(User user) {
        String sql = "UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        jdbcTemplate.update(sql, user.getName(), user.getEmail(), user.getId());
    }

    // Șterge utilizator
    public void deleteById(Integer id) {
        String sql = "DELETE FROM users WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    // Listă toți utilizatorii
    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }
}
