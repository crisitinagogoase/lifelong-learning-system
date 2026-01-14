package com.learning.service;

import com.learning.model.Course;
import com.learning.model.Recommendation;
import com.learning.repository.CourseRepository;
import com.learning.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    private static final Map<String, Map<String, Object>> MARKET_TRENDS = Map.of(
        "Machine Learning", Map.of("demand", "high", "growth", 35, "avgSalary", 85000),
        "Data Science", Map.of("demand", "high", "growth", 30, "avgSalary", 80000),
        "Cloud Computing", Map.of("demand", "high", "growth", 42, "avgSalary", 90000),
        "DevOps", Map.of("demand", "high", "growth", 28, "avgSalary", 95000),
        "Full Stack Development", Map.of("demand", "medium", "growth", 25, "avgSalary", 75000)
    );

    private static final Map<String, List<String>> JOB_TITLES = Map.of(
        "Software Engineer", List.of("Programming", "Problem Solving", "System Design"),
        "Data Scientist", List.of("Python", "Machine Learning", "Statistics", "Data Analysis"),
        "DevOps Engineer", List.of("CI/CD", "Docker", "Kubernetes", "Cloud"),
        "Full Stack Developer", List.of("Frontend", "Backend", "Database", "API Design")
    );

    public Recommendation generateRecommendations(Integer userId) {
        List<com.learning.model.UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        Set<String> skillNames = userSkills.stream()
            .map(com.learning.model.UserSkill::getSkillName)
            .map(String::toLowerCase)
            .collect(Collectors.toSet());

        Recommendation recommendation = new Recommendation();
        recommendation.setCourses(generateCourseRecommendations(userId, skillNames));
        recommendation.setCareerPaths(generateCareerPaths(skillNames));
        recommendation.setSkillGaps(generateSkillGaps(userSkills));

        return recommendation;
    }

    private List<Recommendation.CourseRecommendation> generateCourseRecommendations(
            Integer userId, Set<String> userSkills) {
        
        List<Course> allCourses = courseRepository.findAll();
        List<Recommendation.CourseRecommendation> recommendations = new ArrayList<>();

        for (Course course : allCourses) {
            // Get course skills from database
            List<String> courseSkills = getCourseSkills(course.getId());
            
            // Calculate relevance
            long matchingSkills = courseSkills.stream()
                .map(String::toLowerCase)
                .filter(userSkills::contains)
                .count();
            
            if (matchingSkills > 0 || courseSkills.isEmpty()) {
                BigDecimal relevance = courseSkills.isEmpty() 
                    ? new BigDecimal("0.5")
                    : BigDecimal.valueOf(matchingSkills)
                        .divide(BigDecimal.valueOf(courseSkills.size()), 2, RoundingMode.HALF_UP)
                        .multiply(course.getMarketRelevance());
                
                Recommendation.CourseRecommendation rec = new Recommendation.CourseRecommendation();
                rec.setCourseId(course.getId());
                rec.setTitle(course.getTitle());
                rec.setDescription(course.getDescription());
                rec.setProvider(course.getProvider());
                rec.setLevel(course.getLevel());
                rec.setRelevance(relevance);
                rec.setMatchedSkills(courseSkills.stream()
                    .filter(s -> userSkills.contains(s.toLowerCase()))
                    .collect(Collectors.toList()));
                rec.setMissingPrerequisites(new ArrayList<>());
                
                recommendations.add(rec);
            }
        }

        return recommendations.stream()
            .sorted((a, b) -> b.getRelevance().compareTo(a.getRelevance()))
            .limit(10)
            .collect(Collectors.toList());
    }

    private List<Recommendation.CareerPath> generateCareerPaths(Set<String> userSkills) {
        List<Recommendation.CareerPath> paths = new ArrayList<>();

        for (Map.Entry<String, List<String>> entry : JOB_TITLES.entrySet()) {
            String title = entry.getKey();
            List<String> requiredSkills = entry.getValue();
            
            List<String> matched = requiredSkills.stream()
                .map(String::toLowerCase)
                .filter(userSkills::contains)
                .collect(Collectors.toList());
            
            if (!matched.isEmpty()) {
                int matchPercentage = (matched.size() * 100) / requiredSkills.size();
                
                Recommendation.CareerPath path = new Recommendation.CareerPath();
                path.setTitle(title);
                path.setMatchPercentage(matchPercentage + "%");
                path.setDescription("Based on your skills in " + String.join(", ", matched));
                path.setRequiredSkills(requiredSkills);
                path.setMatchedSkills(matched);
                path.setMissingSkills(requiredSkills.stream()
                    .filter(s -> !userSkills.contains(s.toLowerCase()))
                    .collect(Collectors.toList()));
                path.setAverageSalary("$60,000 - $80,000");
                path.setGrowthRate("+20% over 5 years");
                
                paths.add(path);
            }
        }

        return paths.stream()
            .sorted((a, b) -> Integer.compare(
                Integer.parseInt(b.getMatchPercentage().replace("%", "")),
                Integer.parseInt(a.getMatchPercentage().replace("%", ""))
            ))
            .limit(5)
            .collect(Collectors.toList());
    }

    private List<Recommendation.SkillGap> generateSkillGaps(List<com.learning.model.UserSkill> userSkills) {
        List<Recommendation.SkillGap> gaps = new ArrayList<>();

        for (com.learning.model.UserSkill skill : userSkills) {
            Map<String, Object> trend = MARKET_TRENDS.get(skill.getSkillName());
            int requiredLevel = trend != null && "high".equals(trend.get("demand")) ? 75 : 50;
            int currentLevel = skill.getSkillLevel();
            int gap = requiredLevel - currentLevel;

            if (gap > 0) {
                Recommendation.SkillGap skillGap = new Recommendation.SkillGap();
                skillGap.setSkill(skill.getSkillName());
                skillGap.setCurrentLevel(currentLevel);
                skillGap.setRequiredLevel(requiredLevel);
                skillGap.setGap(gap);
                skillGap.setPriority(gap > 30 ? "high" : gap > 15 ? "medium" : "low");
                skillGap.setTrend(trend != null && (Integer) trend.get("growth") > 30 ? "rising" : "stable");
                gaps.add(skillGap);
            }
        }

        return gaps;
    }

    private List<String> getCourseSkills(Integer courseId) {
        return courseRepository.getCourseSkills(courseId);
    }
}
