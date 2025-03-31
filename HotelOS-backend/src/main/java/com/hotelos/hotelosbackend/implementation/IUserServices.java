package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import com.hotelos.hotelosbackend.repository.UserRepository;
import com.hotelos.hotelosbackend.services.FileStorageService;
import com.hotelos.hotelosbackend.services.UserServices;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class IUserServices implements UserServices {
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public IUserServices(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String imagePath = fileStorageService.storeFile(file, "users");

        if (imagePath == null || imagePath.isEmpty()) {
            throw new IOException("Failed to store file: " + file.getOriginalFilename());
        }
        return imagePath;
    }

    @Override
    public byte[] getFile(String filePath) throws IOException {
        return fileStorageService.getFile(filePath);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> findAllGuests() {
        return userRepository.findByUserType(UserType.GUEST);
    }

    @Override
    public List<User> findAllStaff() {
        return userRepository.findByUserType(UserType.STAFF);
    }

    @Override
    public List<User> findAllManagers() {
        return userRepository.findByUserType(UserType.MANAGER);
    }

    @Override
    public List<User> findAllAdmins() {
        return userRepository.findByUserType(UserType.ADMIN);
    }

    @Override
    public List<User> getUsersByHotel(Hotel hotel) {
        return userRepository.findByHotel(hotel);
    }
}