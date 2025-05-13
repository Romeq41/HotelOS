package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.dto.HotelStatisticsDto;
import com.hotelos.hotelosbackend.models.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface HotelServices {
    Hotel saveHotel(Hotel person);

    String storeFile(MultipartFile file) throws IOException;

    HotelStatisticsDto getHotelStatistics(Hotel hotel);

    byte[] getFile(String filePath) throws IOException;

    Page<Hotel> getAllHotels(Pageable pageable);

    Page<Hotel> getHotelsByName(Pageable pageable, String hotel_name);

    Optional<Hotel> getHotelById(Long id);

    Page<Hotel> getHotelsWithFilters(String hotel_name, Pageable pageable);

    void deleteHotel(Long id);
}
