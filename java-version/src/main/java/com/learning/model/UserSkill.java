package com.learning.model;

public class UserSkill {
    private Integer id;
    private Integer userId;
    private String skillName;
    private Integer skillLevel; // 0-100
    private String category;

    public UserSkill() {}

    public UserSkill(Integer userId, String skillName, Integer skillLevel, String category) {
        this.userId = userId;
        this.skillName = skillName;
        this.skillLevel = skillLevel;
        this.category = category;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public Integer getSkillLevel() { return skillLevel; }
    public void setSkillLevel(Integer skillLevel) { this.skillLevel = skillLevel; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
