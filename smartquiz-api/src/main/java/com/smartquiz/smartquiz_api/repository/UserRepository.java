package com.smartquiz.smartquiz_api.repository;

import com.smartquiz.smartquiz_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@SuppressWarnings("unused")
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}