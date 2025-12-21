package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.UserDto;
import com.hotelos.hotelosbackend.mapper.UserMapper;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import com.hotelos.hotelosbackend.services.UserServices;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserMapper userMapper;

    @PostMapping
    public ResponseEntity<UserDto> addUser(@Valid @RequestBody UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        User savedUser = userServices.saveUser(user);
        return ResponseEntity.ok(userMapper.toDto(savedUser));
    }

    @PostMapping("/{id}/image_upload")
    public ResponseEntity<String> uploadUserImage(@PathVariable @Positive(message = "ID must be a positive number") Long id, @RequestParam("file") MultipartFile file) {
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
    public ResponseEntity<String> getRoomImage(@PathVariable @Positive(message = "ID must be a positive number") Long id, HttpServletResponse response) {
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
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") @PositiveOrZero(message = "Page number must be positive") int page,
            @RequestParam(defaultValue = "10") @PositiveOrZero(message = "Page size must be positive") int size,
            @RequestParam(required = false) String email) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> users = userServices.getUsersWithFilters(email, 0L, pageable).map(userMapper::toDto);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable @Positive(message = "ID must be a positive number") Long id) {
        return userServices.getUserById(id).map(userMapper::toDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUserById(
            @PathVariable @PositiveOrZero(message = "ID must be a positive number") Long id,
            @RequestBody UserDto userDto) {
        System.out.println(userDto);
        return userServices.getUserById(id).map(existingUser -> {
            User updatedUser = userMapper.toEntity(userDto);
            updatedUser.setUserId(id);
            updatedUser.setPassword(existingUser.getPassword());
            User savedUser = userServices.updateUser(updatedUser);
            return ResponseEntity.ok(userMapper.toDto(savedUser));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @Positive(message = "ID must be a positive number") Long id) {
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