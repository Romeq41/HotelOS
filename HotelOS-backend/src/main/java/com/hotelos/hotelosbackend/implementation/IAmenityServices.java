package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Amenity;
import com.hotelos.hotelosbackend.repository.AmenityRepository;
import com.hotelos.hotelosbackend.services.AmenityServices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IAmenityServices implements AmenityServices {

    private final AmenityRepository amenityRepository;

    public IAmenityServices(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Override
    public Amenity saveAmenity(Amenity amenity) {
        return amenityRepository.save(amenity);
    }

    @Override
    public Page<Amenity> getAllAmenities(Pageable pageable) {
        return amenityRepository.findAll(pageable);
    }

    @Override
    public Page<Amenity> getAmenitiesByHotelId(Long hotelId, Pageable pageable) {
        return amenityRepository.findByHotel_Id(hotelId, pageable);
    }

    @Override
    public Optional<Amenity> getAmenityById(Long id) {
        return amenityRepository.findById(id);
    }

    @Override
    public void deleteAmenity(Long id) {
        amenityRepository.deleteById(id);
    }
}