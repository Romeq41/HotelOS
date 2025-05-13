package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.room.hotel.id = :hotelId")
    List<Reservation> findAllByHotelId(@Param("hotelId") Long hotelId);
}
