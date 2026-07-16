package com.smartquiz.smartquiz_api.controller;

import com.smartquiz.smartquiz_api.model.Question;
import com.smartquiz.smartquiz_api.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionRepository.save(question);
    }

    @PutMapping
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        Question question = questionRepository.findById(id).orElseThrow();

        question.setTeksSoal(questionDetails.getTeksSoal());
        question.setOpsiA(questionDetails.getOpsiA());
        question.setOpsiB(questionDetails.getOpsiB());
        question.setOpsiC(questionDetails.getOpsiC());
        question.setOpsiD(questionDetails.getOpsiD());
        question.setKunciJawaban(questionDetails.getKunciJawaban());

        return questionRepository.save(question);
    }

    @DeleteMapping("/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
        return "Soal dengan ID " + id + " berhasil dihapus!";
    }
}