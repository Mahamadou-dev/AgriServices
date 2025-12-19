package com.gremahtech.authservice.service;

import com.gremahtech.authservice.dto.AuthResponse;
import com.gremahtech.authservice.dto.LoginRequest;
import com.gremahtech.authservice.dto.RegisterRequest;
import com.gremahtech.authservice.model.User;
import com.gremahtech.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${farmer.service.url:http://farmer-service:3001}")
    private String farmerServiceUrl;
    
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
        
        User savedUser = userRepository.save(user);
        
        // If role is FARMER and profile data is provided, create farmer profile
        if ("FARMER".equals(savedUser.getRole()) && 
            request.getFirstName() != null && 
            request.getLastName() != null && 
            request.getPhone() != null) {
            createFarmerProfile(savedUser, request);
        }
        
        return savedUser;
    }
    
    private void createFarmerProfile(User user, RegisterRequest request) {
        try {
            Map<String, Object> farmerData = new HashMap<>();
            farmerData.put("userId", user.getId().toString());
            farmerData.put("firstName", request.getFirstName());
            farmerData.put("lastName", request.getLastName());
            farmerData.put("phone", request.getPhone());
            farmerData.put("email", user.getEmail());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // Add internal service header to bypass auth
            headers.set("X-Internal-Service", "auth-service");
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farmerData, headers);
            
            restTemplate.postForObject(
                farmerServiceUrl + "/api/farmers/internal/create",
                entity,
                String.class
            );
            
            System.out.println("✅ Farmer profile created for user: " + user.getUsername());
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("⚠️ Failed to create farmer profile: " + e.getMessage());
        }
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

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        // Delete user
        userRepository.deleteById(id);
        // Also delete farmer profile if exists
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Internal-Service", "auth-service");
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            restTemplate.exchange(
                farmerServiceUrl + "/api/farmers/internal/delete/" + id,
                org.springframework.http.HttpMethod.DELETE,
                entity,
                String.class
            );
            System.out.println("✅ Farmer profile deleted for userId: " + id);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to delete farmer profile: " + e.getMessage());
        }
    }
}
