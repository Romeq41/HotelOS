package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;

import java.util.List;
import java.util.Optional;

public interface UserServices {
    User saveUser(User user);

    List<User> getAllUsers();

    User updateUser(User user);

    Optional<User> getUserById(Long id);

    void deleteUser(Long id);


    // Additional methods for specific user types
    List<User> findAllGuests();

    List<User> findAllStaff();

    List<User> findAllManagers();

    List<User> findAllAdmins();

    List<User> getUsersByHotel(Hotel hotel);
}