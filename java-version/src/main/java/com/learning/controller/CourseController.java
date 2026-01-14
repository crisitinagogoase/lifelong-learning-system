package com.learning.controller;

import com.learning.model.Course;
import com.learning.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Obține toate cursurile
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    // Obține curs după ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Integer id) {
        try {
            Course course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // Obține cursuri recomandate pentru utilizator
    @GetMapping("/recommendations")
    public ResponseEntity<List<Course>> getRecommendedCourses(@RequestParam Integer userId) {
        List<Course> courses = courseService.getRecommendedCourses(userId);
        return ResponseEntity.ok(courses);
    }

    // Obține cursuri după nivel
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Course>> getCoursesByLevel(@PathVariable String level) {
        List<Course> courses = courseService.getCoursesByLevel(level);
        return ResponseEntity.ok(courses);
    }

    // Creează curs nou (pentru admin)
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(201).body(createdCourse);
    }
}
