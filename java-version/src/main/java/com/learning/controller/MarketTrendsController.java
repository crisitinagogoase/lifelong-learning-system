package com.learning.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market-trends")
@CrossOrigin(origins = "*")
public class MarketTrendsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMarketTrends() {
        String sql = """
            SELECT skill_name, demand, growth_percentage, avg_salary
            FROM market_trends
            ORDER BY growth_percentage DESC
            """;
        
        List<Map<String, Object>> trends = jdbcTemplate.query(sql,
            (rs, rowNum) -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("skillName", rs.getString("skill_name"));
                map.put("demand", rs.getString("demand"));
                map.put("growthPercentage", rs.getInt("growth_percentage"));
                map.put("avgSalary", rs.getInt("avg_salary"));
                return map;
            });
        
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/{skillName}")
    public ResponseEntity<Map<String, Object>> getSkillTrend(@PathVariable String skillName) {
        String sql = "SELECT * FROM market_trends WHERE skill_name = ?";
        
        Map<String, Object> trend = jdbcTemplate.queryForMap(sql, skillName);
        return ResponseEntity.ok(trend);
    }
}
