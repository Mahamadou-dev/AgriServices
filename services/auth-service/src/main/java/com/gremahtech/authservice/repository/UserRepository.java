package com.gremahtech.authservice.repository; // <-- DOIT ÊTRE CECI

import com.gremahtech.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}