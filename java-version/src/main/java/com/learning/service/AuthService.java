package com.learning.service;

import com.learning.model.User;
import com.learning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    // Înregistrare utilizator nou
    public User register(String name, String email, String password) {
        // Verifică dacă email-ul există deja
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email deja folosit: " + email);
        }

        // Hash-uiește parola
        String hashedPassword = passwordEncoder.encode(password);

        // Creează utilizator nou
        User user = new User(name, email, hashedPassword);
        return userRepository.save(user);
    }

    // Autentificare utilizator
    public User login(String email, String password) {
        // Găsește utilizator după email
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email sau parolă incorectă");
        }

        User user = userOpt.get();

        // Verifică parola
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Email sau parolă incorectă");
        }

        // Returnează utilizator (fără parolă în producție, ar trebui să folosești DTO)
        return user;
    }

    // Verifică dacă email-ul există
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
