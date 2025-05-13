package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import com.hotelos.hotelosbackend.services.FileStorageService;
import com.hotelos.hotelosbackend.services.HotelServices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class IHotelServices implements HotelServices {
    private final HotelRepository hotelRepository;

    private final FileStorageService fileStorageService;

    public IHotelServices(HotelRepository hotelRepository, FileStorageService fileStorageService) {
        this.hotelRepository = hotelRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String imagePath = fileStorageService.storeFile(file, "hotels");

        if (imagePath == null || imagePath.isEmpty()) {
            throw new IOException("Failed to store file: " + file.getOriginalFilename());
        }
        return imagePath;
    }

    @Override
    public byte[] getFile(String filePath) throws IOException {
        return fileStorageService.getFile(filePath);
    }


    //    @Override
//    public Page<User> getAllUsers(Pageable pageable) {
//        return userRepository.findAll(pageable);
//    }
//
//    @Override
//    public Page<User> getUsersByEmail(Pageable pageable, String email) {
//        return userRepository.findByEmailContainingIgnoreCase(email, pageable);
//    }
//    @Override
//    public Page<User> getUsersWithFilters(String email, Pageable pageable) {
//        Optional<String> emailOpt = Optional.ofNullable(email).filter(e -> !e.isBlank());
//
//       if (emailOpt.isPresent()) {
//            return getUsersByEmail(pageable, emailOpt.get());
//        } else {
//            return getAllUsers(pageable);
//        }
//    }
    @Override
    public Page<Hotel> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable);
    }

    @Override
    public Page<Hotel> getHotelsByName(Pageable pageable, String hotel_name) {
        return hotelRepository.findByNameContainingIgnoreCase(hotel_name, pageable);
    }

    @Override
    public Page<Hotel> getHotelsWithFilters(String hotel_name, Pageable pageable) {
        Optional<String> hotel_nameOpt = Optional.ofNullable(hotel_name).filter(e -> !e.isBlank());

        if (hotel_nameOpt.isPresent()) {
            return getHotelsByName(pageable, hotel_nameOpt.get());
        } else {
            return getAllHotels(pageable);
        }
    }

    @Override
    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    @Override
    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }
}