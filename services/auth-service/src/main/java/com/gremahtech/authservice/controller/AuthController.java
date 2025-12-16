// File: src/main/java/com/gremahtech/authservice/controller/AuthController.java

package com.gremahtech.authservice.controller;

import com.gremahtech.authservice.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    // Route simple pour générer un jeton (simule la connexion réussie)
    @GetMapping("/token")
    public ResponseEntity<String> getToken(@RequestParam String username, @RequestParam String role) {
        // En réalité, ici il y aurait la vérification du mot de passe en base de données.

        if (username.isEmpty() || role.isEmpty()) {
            return ResponseEntity.badRequest().body("Username and role are required.");
        }

        String token = jwtService.generateToken(username, role);

        // Retourne le jeton encodé
        return ResponseEntity.ok(token);
    }

    // Endpoint pour tester le service (Health check)
    @GetMapping("/hello")
    public String hello() {
        return "Auth-Service is running and ready on port 8081!";
    }
}