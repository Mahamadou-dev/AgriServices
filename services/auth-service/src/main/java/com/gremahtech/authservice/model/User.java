// File: src/main/java/com/gremahtech/authservice/model/User.java

package com.gremahtech.authservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {
    @Id
    private Long id;
    private String username;
    private String password; // Non sécurisé pour le TP, mais utilise Bcrypt en réel
    private String role; // Exemple: FARMER, EXPERT

    // Getters and Setters (à générer via IntelliJ)
    // ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}