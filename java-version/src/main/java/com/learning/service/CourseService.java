package com.learning.service;

import com.learning.model.Course;
import com.learning.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Obține toate cursurile
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Obține curs după ID
    public Course getCourseById(Integer id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curs negăsit cu ID: " + id));
    }

    // Obține cursuri recomandate pentru utilizator
    public List<Course> getRecommendedCourses(Integer userId) {
        return courseRepository.findRecommendedForUser(userId);
    }

    // Obține cursuri după nivel
    public List<Course> getCoursesByLevel(String level) {
        return courseRepository.findByLevel(level);
    }

    // Creează curs nou
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }
}
