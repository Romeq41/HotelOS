package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface UserServices {
    User saveUser(User user);

    Page<User> getAllUsers(Pageable pageable);

    Page<User> getUsersByEmail(Pageable pageable, String email);

    Page<User> getUsersWithFilters(String email, long hotelId, Pageable pageable);

    User updateUser(User user);

    Optional<User> getUserById(Long id);

    void deleteUser(Long id);

    String storeFile(MultipartFile file) throws IOException;

    byte[] getFile(String filePath) throws IOException;

    // Additional methods for specific user types
    List<User> findAllGuests();

    List<User> findAllStaff();

    List<User> findAllManagers();

    List<User> findAllAdmins();

    List<User> getUsersByHotel(Hotel hotel);
}