package com.smartquiz.smartquiz_api.controller;

import com.smartquiz.smartquiz_api.model.Quiz;
import com.smartquiz.smartquiz_api.model.User;
import com.smartquiz.smartquiz_api.dto.QuizResultRequest;
import com.smartquiz.smartquiz_api.repository.QuizRepository;
import com.smartquiz.smartquiz_api.repository.QuestionRepository;
import com.smartquiz.smartquiz_api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository; 

    public QuizController(QuizRepository quizRepository, QuestionRepository questionRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAllPublishedQuizzes() {
        return quizRepository.findByPublishedTrue().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<Map<String, Object>> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Quiz payload) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    quiz.setJudul(payload.getJudul());
                    quiz.setDeskripsi(payload.getDeskripsi());
                    quiz.setKategori(payload.getKategori());
                    quiz.setDurasiMenit(payload.getDurasiMenit());
                    quiz.setPublished(payload.isPublished());
                    return ResponseEntity.ok(quizRepository.save(quiz));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        if (!quizRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        quizRepository.deleteById(id);
        return ResponseEntity.ok("Kuis dengan ID " + id + " berhasil dihapus!");
    }

    private Map<String, Object> toSummary(Quiz quiz) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", quiz.getId());
        map.put("judul", quiz.getJudul());
        map.put("deskripsi", quiz.getDeskripsi());
        map.put("kategori", quiz.getKategori());
        map.put("durasiMenit", quiz.getDurasiMenit());
        map.put("published", quiz.isPublished());
        map.put("jumlahSoal", questionRepository.findByQuizId(quiz.getId()).size());
        return map;
    }

    @PostMapping("/submit-result")
    public ResponseEntity<?> submitQuizResult(@RequestBody QuizResultRequest request) {
        if (request == null || request.getUserId() == null) {
            return ResponseEntity.badRequest().body("Data submit tidak lengkap!");
        }

        Optional<User> userOptional = userRepository.findById(request.getUserId());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User tidak ditemukan!");
        }

        User user = userOptional.get();

        user.setTotalQuiz(safeInt(user.getTotalQuiz()) + 1);
        user.setTotalPoin(safeInt(user.getTotalPoin()) + safeInt(request.getEarnedPoints()));

        if (Boolean.TRUE.equals(request.getIsWin())) {
            user.setKuisMenang(safeInt(user.getKuisMenang()) + 1);
        }

        user.calculateTingkatKemenangan();

        if (request.getUsedBuffs() != null && !request.getUsedBuffs().isEmpty()) {
            if (user.getActiveBuffs() == null) {
                user.setActiveBuffs(new java.util.ArrayList<>());
            }
            user.getActiveBuffs().removeAll(request.getUsedBuffs());
        }

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    private int safeInt(Integer value) {
        return value != null ? value : 0;
    }
}