package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import com.hotelos.hotelosbackend.services.HotelServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IHotelServices implements HotelServices {
    private final HotelRepository hotelRepository;

    public IHotelServices(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
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