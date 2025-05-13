package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findByReservationNameContainsIgnoreCaseAndRoomHotelId(String reservationName, Long hotelId, Pageable pageable);

    Page<Reservation> findByRoomRoomNumberAndRoomHotelId(Long roomNumber,Long hotelId, Pageable pageable);

    Page<Reservation> findByReservationNameContainsIgnoreCaseAndRoomRoomNumberAndRoomHotelId(String reservationName, Long roomNumber, Long hotelId, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.room.hotel.id = :hotelId")
    List<Reservation> findAllByHotelId(@Param("hotelId") Long hotelId);
}
