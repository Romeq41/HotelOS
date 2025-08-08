package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.dto.HotelOfferDto;
import com.hotelos.hotelosbackend.dto.HotelStatisticsDto;
import com.hotelos.hotelosbackend.models.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

public interface HotelServices {
    Hotel saveHotel(Hotel person);

    String storeFile(MultipartFile file) throws IOException;

    HotelStatisticsDto getHotelStatistics(Hotel hotel);

    byte[] getFile(String filePath) throws IOException;

    Page<Hotel> getAllHotels(Pageable pageable);

    Page<Hotel> getHotelsByName(Pageable pageable, String hotel_name);

    HotelOfferDto getHotelOfferById(Long id, LocalDate checkIn, LocalDate checkOut);

    Optional<Hotel> getHotelById(Long id);

    List<Hotel> getHotelsWithFilters(String hotelName, String country, String city);

    Page<Hotel> getHotelsWithFiltersPaginated(String hotelName, String country, String city, Pageable pageable);

    Page<HotelOfferDto> getHotelsOffersWithFilters(String hotel_name, String country, String city, String sortBy, Pageable pageable);

    void deleteHotel(Long id);
}
