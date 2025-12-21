package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    List<RoomType> findAllByisActiveTrue();

    List<RoomType> findByHotelIdOrHotelIsNull(Long hotelId);

    List<RoomType> findByisActiveTrueAndHotelIdOrHotelIsNull(Long hotelId);

    Optional<RoomType> findByNameAndHotelId(String name, Long hotelId);
}