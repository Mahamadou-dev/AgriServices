package com.gremahtech.authservice.dto;

public class AuthResponse {
    private String token;
    private Long expiresIn;
    private String username;
    private String role;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, Long expiresIn, String username, String role) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.username = username;
        this.role = role;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}
