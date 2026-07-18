package com.smartquiz.smartquiz_api.controller;

import com.smartquiz.smartquiz_api.model.AvatarPayload;
import com.smartquiz.smartquiz_api.model.User;
import com.smartquiz.smartquiz_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/avatar")
@CrossOrigin(origins = "http://localhost:5173")
public class AvatarController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveAvatar(@RequestBody AvatarPayload payload) {
        Long userId = 1L; 
        
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setWarnaAvatar(payload.getColor());
            user.setJenisTopi(payload.getHatId());
            user.setTopiX(payload.getHatPositionX());
            user.setTopiY(payload.getHatPositionY());
            user.setTopiWidth(payload.getHatWidth());
            user.setTopiHeight(payload.getHatHeight());
            user.setTopiRotation(payload.getHatRotation());

            userRepository.save(user);
            
            return ResponseEntity.ok().body("{\"message\": \"Karakter berhasil disimpan ke Database!\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"error\": \"User tidak ditemukan\"}");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAvatar() {
        
        Long userId = 1L; // Sama, pakai ID 1 dulu buat testing
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            AvatarPayload responseData = new AvatarPayload();
            responseData.setColor(user.getWarnaAvatar());
            responseData.setHatId(user.getJenisTopi());
            responseData.setHatPositionX(user.getTopiX() != null ? user.getTopiX() : 100);
            responseData.setHatPositionY(user.getTopiY() != null ? user.getTopiY() : 40);
            responseData.setHatWidth(user.getTopiWidth() != null ? user.getTopiWidth() : 100);
            responseData.setHatHeight(user.getTopiHeight() != null ? user.getTopiHeight() : 100);
            responseData.setHatRotation(user.getTopiRotation() != null ? user.getTopiRotation() : 0);
            
            return ResponseEntity.ok(responseData);
        }
        
        return ResponseEntity.badRequest().body("{}");
    }
}