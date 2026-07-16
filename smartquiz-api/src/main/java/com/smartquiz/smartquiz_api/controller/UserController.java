package com.smartquiz.smartquiz_api.controller;

import com.smartquiz.smartquiz_api.model.User;
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
    public User updateAvatar(@PathVariable Long id, @RequestBody User request) {
        User user = userRepository.findById(id).orElseThrow();
        
        user.setJenisTopi(request.getJenisTopi());
        user.setWarnaAvatar(request.getWarnaAvatar());
        
        return userRepository.save(user);
    }
}