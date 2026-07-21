package com.smartquiz.smartquiz_api.controller;

import com.smartquiz.smartquiz_api.dto.QuizResultRequest;
import com.smartquiz.smartquiz_api.model.User;
import com.smartquiz.smartquiz_api.repository.QuestionRepository;
import com.smartquiz.smartquiz_api.repository.QuizRepository;
import com.smartquiz.smartquiz_api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizControllerTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private QuizController quizController;

    @Test
    void submitQuizResult_shouldHandleNullStatsAndBuffs() {
        User user = new User();
        user.setId(7L);
        user.setEmail("test@example.com");
        user.setNama("Tester");
        user.setTotalQuiz(null);
        user.setTotalPoin(null);
        user.setKuisMenang(null);
        user.setActiveBuffs(null);

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuizResultRequest request = new QuizResultRequest();
        request.setUserId(7L);
        request.setEarnedPoints(100);
        request.setIsWin(true);
        request.setUsedBuffs(List.of("double"));

        ResponseEntity<?> response = quizController.submitQuizResult(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userRepository).save(any(User.class));
        assertThat(user.getTotalQuiz()).isEqualTo(1);
        assertThat(user.getTotalPoin()).isEqualTo(100);
        assertThat(user.getKuisMenang()).isEqualTo(1);
        assertThat(user.getActiveBuffs()).isEmpty();
    }
}
