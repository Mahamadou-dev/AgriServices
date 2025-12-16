package com.gremahtech.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// @SpringBootApplication combine @Configuration, @EnableAutoConfiguration, et @ComponentScan
@SpringBootApplication
// Active la détection des interfaces Repository pour Spring Data JPA
@EnableJpaRepositories("com.gremahtech.authservice.repository")
public class AuthServiceApplication {

    public static void main(String[] args) {
        // Lance l'application Spring Boot
        SpringApplication.run(AuthServiceApplication.class, args);
        System.out.println("Auth-Service démarré avec succès.");
    }

}