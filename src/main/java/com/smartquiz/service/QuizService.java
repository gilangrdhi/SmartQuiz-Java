package com.smartquiz.service;

import com.smartquiz.model.Question;
import com.smartquiz.repository.QuestionRepository;
import java.util.List;

public class QuizService {
    private QuestionRepository repository;

    public QuizService(QuestionRepository repository) {
        this.repository = repository;
    }

    public void setupDefaultQuestions(List<Question> defaultQuestions) {
        String[] opsi1 = {"A. Jakarta", "B. Bandung", "C. Surabaya", "D. Medan"};
        Question soal1 = new Question(1,"Apa ibu kota Indonesia?", opsi1, "A");
        repository.addQuestion(soal1);

        String[] opsi2 = {"A. 1945", "B. 1949", "C. 1950", "D. 1955"};
        Question soal2 = new Question(2,"Kapan Indonesia merdeka?", opsi2, "A");
        repository.addQuestion(soal2);
    }

    public List<Question> getQuestionList() {
        return repository.getAllQuestions();
    }

    public void addQuestion(Question question) {
        repository.addQuestion(question);
    }
}
