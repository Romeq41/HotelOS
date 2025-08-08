package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    Page<Amenity> findByHotel_Id(Long hotelId, Pageable pageable);
    List<Amenity> findByHotel_Id(Long hotelId);
}