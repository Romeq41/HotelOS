package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import com.hotelos.hotelosbackend.services.UserServices;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping("/{id}/image_upload")
    public ResponseEntity<String> uploadUserImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            String filePath = userServices.storeFile(file);

            if (filePath == null || filePath.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            User user = userServices.getUserById(id).orElseThrow(() -> new RuntimeException("User not found"));
            user.setImagePath(filePath);

            userServices.saveUser(user);
            return ResponseEntity.ok("File uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<String> getRoomImage(@PathVariable Long id, HttpServletResponse response) {
        try {
            User user = userServices.getUserById(id).orElseThrow(() -> new RuntimeException("User not found"));
            if (user.getImagePath() == null || user.getImagePath().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            byte[] image = userServices.getFile(user.getImagePath());
            if (image == null || image.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            response.setContentType(MediaType.IMAGE_JPEG_VALUE);
            StreamUtils.copy(image, response.getOutputStream());

            return ResponseEntity.ok(new String(image));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
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

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserById(@RequestBody User userDetails) {
        return userServices.getUserById(userDetails.getUserId())
                .map(user -> {
                    user.setFirstName(userDetails.getFirstName());
                    user.setLastName(userDetails.getLastName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhone(userDetails.getPhone());
                    user.setAddress(userDetails.getAddress());
                    user.setCity(userDetails.getCity());
                    user.setState(userDetails.getState());
                    user.setCountry(userDetails.getCountry());
                    user.setZipCode(userDetails.getZipCode());
                    user.setHotel(userDetails.getHotel());
                    user.setPassword(userDetails.getPassword());
                    user.setUserType(userDetails.getUserType());
                    user.setPosition(userDetails.getPosition());
                    User updatedUser = userServices.updateUser(user);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userServices.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (userServices.getUserById(id).get().getUserType() == UserType.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        userServices.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}