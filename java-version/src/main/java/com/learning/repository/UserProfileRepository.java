package com.learning.repository;

import com.learning.model.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@Repository
public class UserProfileRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static class UserProfileRowMapper implements RowMapper<UserProfile> {
        @Override
        public UserProfile mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserProfile profile = new UserProfile();
            profile.setId(rs.getInt("id"));
            profile.setUserId(rs.getInt("user_id"));
            profile.setBio(rs.getString("bio"));
            profile.setLocation(rs.getString("location"));
            profile.setWebsite(rs.getString("website"));
            profile.setCareerGoal(rs.getString("career_goal"));
            return profile;
        }
    }

    public Optional<UserProfile> findByUserId(Integer userId) {
        String sql = "SELECT * FROM user_profiles WHERE user_id = ?";
        try {
            UserProfile profile = jdbcTemplate.queryForObject(sql, new UserProfileRowMapper(), userId);
            return Optional.ofNullable(profile);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void save(UserProfile profile) {
        String sql = """
            INSERT INTO user_profiles (user_id, bio, location, website, career_goal)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (user_id) DO UPDATE SET
                bio = EXCLUDED.bio,
                location = EXCLUDED.location,
                website = EXCLUDED.website,
                career_goal = EXCLUDED.career_goal,
                updated_at = CURRENT_TIMESTAMP
            """;
        jdbcTemplate.update(sql, profile.getUserId(), profile.getBio(), 
                          profile.getLocation(), profile.getWebsite(), profile.getCareerGoal());
    }
}
