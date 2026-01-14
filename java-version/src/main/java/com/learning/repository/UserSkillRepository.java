package com.learning.repository;

import com.learning.model.UserSkill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserSkillRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static class UserSkillRowMapper implements RowMapper<UserSkill> {
        @Override
        public UserSkill mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserSkill skill = new UserSkill();
            skill.setId(rs.getInt("id"));
            skill.setUserId(rs.getInt("user_id"));
            skill.setSkillName(rs.getString("skill_name"));
            skill.setSkillLevel(rs.getInt("skill_level"));
            skill.setCategory(rs.getString("category"));
            return skill;
        }
    }

    public List<UserSkill> findByUserId(Integer userId) {
        String sql = "SELECT * FROM user_skills WHERE user_id = ? ORDER BY skill_level DESC";
        return jdbcTemplate.query(sql, new UserSkillRowMapper(), userId);
    }

    public void save(UserSkill skill) {
        String sql = "INSERT INTO user_skills (user_id, skill_name, skill_level, category) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, skill.getUserId(), skill.getSkillName(), 
                          skill.getSkillLevel(), skill.getCategory());
    }

    public void deleteByUserIdAndSkillName(Integer userId, String skillName) {
        String sql = "DELETE FROM user_skills WHERE user_id = ? AND skill_name = ?";
        jdbcTemplate.update(sql, userId, skillName);
    }

    public void update(UserSkill skill) {
        String sql = "UPDATE user_skills SET skill_level = ?, category = ? WHERE user_id = ? AND skill_name = ?";
        jdbcTemplate.update(sql, skill.getSkillLevel(), skill.getCategory(), 
                          skill.getUserId(), skill.getSkillName());
    }
}
