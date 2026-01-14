package com.learning.model;

import java.math.BigDecimal;
import java.util.List;

public class Recommendation {
    private List<CourseRecommendation> courses;
    private List<CareerPath> careerPaths;
    private List<SkillGap> skillGaps;

    public static class CourseRecommendation {
        private Integer courseId;
        private String title;
        private String description;
        private String provider;
        private String level;
        private BigDecimal relevance;
        private List<String> matchedSkills;
        private List<String> missingPrerequisites;

        public Integer getCourseId() { return courseId; }
        public void setCourseId(Integer courseId) { this.courseId = courseId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public BigDecimal getRelevance() { return relevance; }
        public void setRelevance(BigDecimal relevance) { this.relevance = relevance; }
        public List<String> getMatchedSkills() { return matchedSkills; }
        public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }
        public List<String> getMissingPrerequisites() { return missingPrerequisites; }
        public void setMissingPrerequisites(List<String> missingPrerequisites) { this.missingPrerequisites = missingPrerequisites; }
    }

    public static class CareerPath {
        private String title;
        private String matchPercentage;
        private String description;
        private List<String> requiredSkills;
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private String averageSalary;
        private String growthRate;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMatchPercentage() { return matchPercentage; }
        public void setMatchPercentage(String matchPercentage) { this.matchPercentage = matchPercentage; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<String> getRequiredSkills() { return requiredSkills; }
        public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
        public List<String> getMatchedSkills() { return matchedSkills; }
        public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }
        public List<String> getMissingSkills() { return missingSkills; }
        public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }
        public String getAverageSalary() { return averageSalary; }
        public void setAverageSalary(String averageSalary) { this.averageSalary = averageSalary; }
        public String getGrowthRate() { return growthRate; }
        public void setGrowthRate(String growthRate) { this.growthRate = growthRate; }
    }

    public static class SkillGap {
        private String skill;
        private Integer currentLevel;
        private Integer requiredLevel;
        private Integer gap;
        private String priority; // high, medium, low
        private String trend; // rising, stable, declining

        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }
        public Integer getCurrentLevel() { return currentLevel; }
        public void setCurrentLevel(Integer currentLevel) { this.currentLevel = currentLevel; }
        public Integer getRequiredLevel() { return requiredLevel; }
        public void setRequiredLevel(Integer requiredLevel) { this.requiredLevel = requiredLevel; }
        public Integer getGap() { return gap; }
        public void setGap(Integer gap) { this.gap = gap; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getTrend() { return trend; }
        public void setTrend(String trend) { this.trend = trend; }
    }

    public List<CourseRecommendation> getCourses() { return courses; }
    public void setCourses(List<CourseRecommendation> courses) { this.courses = courses; }
    public List<CareerPath> getCareerPaths() { return careerPaths; }
    public void setCareerPaths(List<CareerPath> careerPaths) { this.careerPaths = careerPaths; }
    public List<SkillGap> getSkillGaps() { return skillGaps; }
    public void setSkillGaps(List<SkillGap> skillGaps) { this.skillGaps = skillGaps; }
}
