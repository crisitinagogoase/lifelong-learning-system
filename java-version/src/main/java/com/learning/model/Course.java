package com.learning.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Course {
    private Integer id;
    private String title;
    private String description;
    private String provider;
    private String level;
    private String duration;
    private String url;
    private BigDecimal marketRelevance;
    private LocalDateTime createdAt;

    // Constructors
    public Course() {}

    public Course(String title, String description, String provider, String level, String duration) {
        this.title = title;
        this.description = description;
        this.provider = provider;
        this.level = level;
        this.duration = duration;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public BigDecimal getMarketRelevance() {
        return marketRelevance;
    }

    public void setMarketRelevance(BigDecimal marketRelevance) {
        this.marketRelevance = marketRelevance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
