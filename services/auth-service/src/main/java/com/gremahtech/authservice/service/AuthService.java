package com.gremahtech.authservice.service;

import com.gremahtech.authservice.dto.AuthResponse;
import com.gremahtech.authservice.dto.LoginRequest;
import com.gremahtech.authservice.dto.RegisterRequest;
import com.gremahtech.authservice.model.User;
import com.gremahtech.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Token expiration time in milliseconds (1 hour)
    private static final long EXPIRATION_TIME = 3600000L;
    
    public User register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "FARMER");
        
        return userRepository.save(user);
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername());
        
        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        
        return new AuthResponse(token, EXPIRATION_TIME, user.getUsername(), user.getRole());
    }
    
    public boolean validateToken(String token) {
        try {
            jwtService.validateToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
