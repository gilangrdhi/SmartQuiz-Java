package com.smartquiz.repository;

import com.smartquiz.model.Question;
import java.util.ArrayList;
import java.util.List;

public class QuestionRepository {
    private List<Question> questions;

    public QuestionRepository() {
        this.questions = new ArrayList<>();
    }

    public void addQuestion(Question question) {
        questions.add(question);
    }

    public List<Question> getAllQuestions() {
        return questions;
    }
}
