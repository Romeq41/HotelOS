package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import com.hotelos.hotelosbackend.services.HotelServices;
import com.hotelos.hotelosbackend.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserServices userServices;

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        User savedUser = userServices.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userServices.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userServices.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if(userServices.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if(userServices.getUserById(id).get().getUserType() == UserType.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        userServices.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}