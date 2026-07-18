package com.smartquiz.smartquiz_api.controller;

import com.smartquiz.smartquiz_api.model.User;
import com.smartquiz.smartquiz_api.model.AvatarPayload;
import com.smartquiz.smartquiz_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public User loginOrRegister(@RequestBody User requestUser) {
        return userRepository.findByEmail(requestUser.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(requestUser.getEmail());
                    newUser.setNama(requestUser.getNama());
                    return userRepository.save(newUser);
                });
    }

    @PutMapping("/{id}/avatar")
    public User updateAvatar(@PathVariable Long id, @RequestBody AvatarPayload request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User dengan id " + id + " tidak ditemukan"));

        user.setWarnaAvatar(request.getColor());
        user.setJenisTopi(request.getHatId());
        user.setTopiX(request.getHatPositionX());
        user.setTopiY(request.getHatPositionY());
        user.setTopiWidth(request.getHatWidth());
        user.setTopiHeight(request.getHatHeight());
        user.setTopiRotation(request.getHatRotation());

        return userRepository.save(user);
    }
}