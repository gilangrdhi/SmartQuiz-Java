package com.smartquiz;

import com.smartquiz.repository.QuestionRepository;
import com.smartquiz.service.QuizService;
import com.smartquiz.view.QuizView;

public class App {
    public static void main(String[] args) {
        com.smartquiz.config.DatabaseConfig.getConnection();
        
        QuestionRepository repo = new QuestionRepository();
        QuizService quizService = new QuizService(repo);

        //quizService.setupDefaultQuestions(new java.util.ArrayList<>());

        QuizView view = new QuizView(quizService);

        view.showLogin();
    }
}