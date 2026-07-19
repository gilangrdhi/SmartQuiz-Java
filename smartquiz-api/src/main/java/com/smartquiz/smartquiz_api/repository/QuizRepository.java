package com.smartquiz.smartquiz_api.repository;

import com.smartquiz.smartquiz_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByPublishedTrue();
    List<Quiz> findByDibuatOleh(Long dibuatOleh);
}