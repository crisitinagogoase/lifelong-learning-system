package com.learning.model;

import java.util.List;

public class CVAnalysisResult {
    private List<Skill> skills;
    private List<Experience> experiences;
    private List<String> education;
    private List<Language> languages;
    private String summary;

    public static class Skill {
        private String name;
        private String level; // beginner, intermediate, advanced, expert
        private String category;

        public Skill() {}
        public Skill(String name, String level, String category) {
            this.name = name;
            this.level = level;
            this.category = category;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    public static class Experience {
        private String title;
        private String company;
        private Integer duration;
        private List<String> skills;
        private String description;

        public Experience() {}
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class Language {
        private String name;
        private String level;

        public Language() {}
        public Language(String name, String level) {
            this.name = name;
            this.level = level;
        }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
    }

    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }
    public List<Experience> getExperiences() { return experiences; }
    public void setExperiences(List<Experience> experiences) { this.experiences = experiences; }
    public List<String> getEducation() { return education; }
    public void setEducation(List<String> education) { this.education = education; }
    public List<Language> getLanguages() { return languages; }
    public void setLanguages(List<Language> languages) { this.languages = languages; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}
