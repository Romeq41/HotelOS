package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Hotel;

import java.util.List;
import java.util.Optional;

public interface HotelServices {
    Hotel saveHotel(Hotel person);

    List<Hotel> getAllHotels();

    Optional<Hotel> getHotelById(Long id);

    void deleteHotel(Long id);
}
