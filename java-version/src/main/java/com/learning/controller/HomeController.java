package com.learning.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<String> home() {
        try {
            Resource resource = new ClassPathResource("static/index.html");
            String html = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(html);
        } catch (IOException e) {
            return ResponseEntity.ok("<h1>Learning System API</h1><p>API endpoints:</p><ul><li>GET /api/courses</li><li>POST /api/auth/register</li><li>POST /api/auth/login</li></ul>");
        }
    }
}
