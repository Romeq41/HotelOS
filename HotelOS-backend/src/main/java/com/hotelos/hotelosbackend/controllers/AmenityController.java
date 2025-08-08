package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.AmenityDto;
import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.mapper.AmenityMapper;
import com.hotelos.hotelosbackend.models.Amenity;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.services.AmenityServices;
import com.hotelos.hotelosbackend.services.HotelServices;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/amenities")
public class AmenityController {

    @Autowired
    private AmenityServices amenityServices;

    @Autowired
    private AmenityMapper amenityMapper;

    @PostMapping
    public ResponseEntity<AmenityDto> addAmenity(@Valid @RequestBody AmenityDto amenityDto) {
        Amenity amenity = amenityMapper.toEntity(amenityDto);
        Amenity savedAmenity = amenityServices.saveAmenity(amenity);
        return ResponseEntity.ok(amenityMapper.toDto(savedAmenity));
    }

    @GetMapping
    public ResponseEntity<Page<AmenityDto>> getAllAmenities(
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @PositiveOrZero int size,
            @RequestParam(required = false) Long hotelId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Amenity> amenities;
        if (hotelId != null) {
            amenities = amenityServices.getAmenitiesByHotelId(hotelId, pageable);
        } else {
            amenities = amenityServices.getAllAmenities(pageable);
        }
        return ResponseEntity.ok(amenities.map(amenityMapper::toDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmenityDto> getAmenityById(@PathVariable @Positive Long id) {
        return amenityServices.getAmenityById(id)
                .map(amenityMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Page<AmenityDto>> getAmenitiesByHotelId(
            @PathVariable @Positive Long hotelId,
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @PositiveOrZero int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Amenity> amenities = amenityServices.getAmenitiesByHotelId(hotelId, pageable);
        return ResponseEntity.ok(amenities.map(amenityMapper::toDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmenityDto> updateAmenity(
            @PathVariable @Positive Long id,
            @Valid @RequestBody AmenityDto amenityDto) {
        return amenityServices.getAmenityById(id)
                .map(existingAmenity -> {
                    Amenity amenity = amenityMapper.toEntity(amenityDto);
                    amenity.setId(id);
                    Amenity updatedAmenity = amenityServices.saveAmenity(amenity);
                    return ResponseEntity.ok(amenityMapper.toDto(updatedAmenity));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable @Positive Long id) {
        amenityServices.deleteAmenity(id);
        return ResponseEntity.noContent().build();
    }
}