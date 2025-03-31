package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Hotel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface HotelServices {
    Hotel saveHotel(Hotel person);

    String storeFile(MultipartFile file) throws IOException;

    byte[] getFile(String filePath) throws IOException;

    List<Hotel> getAllHotels();

    Optional<Hotel> getHotelById(Long id);

    void deleteHotel(Long id);
}
