package com.smartquiz.smartquiz_api.repository;

import com.smartquiz.smartquiz_api.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    
}