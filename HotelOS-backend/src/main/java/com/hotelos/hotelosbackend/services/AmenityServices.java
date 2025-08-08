package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface AmenityServices {
    Amenity saveAmenity(Amenity amenity);

    Page<Amenity> getAllAmenities(Pageable pageable);

    Page<Amenity> getAmenitiesByHotelId(Long hotelId, Pageable pageable);

    Optional<Amenity> getAmenityById(Long id);

    void deleteAmenity(Long id);
}