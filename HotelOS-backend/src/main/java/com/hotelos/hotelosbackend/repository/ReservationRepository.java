package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
        Page<Reservation> findByReservationNameContainsIgnoreCaseAndRoomHotelId(String reservationName, Long hotelId,
                        Pageable pageable);

        Page<Reservation> findByRoomRoomNumberAndRoomHotelId(Long roomNumber, Long hotelId, Pageable pageable);

        Page<Reservation> findByReservationNameContainsIgnoreCaseAndRoomRoomNumberAndRoomHotelId(String reservationName,
                        Long roomNumber, Long hotelId, Pageable pageable);

        Page<Reservation> findAllByRoomHotelId(Long hotelId, Pageable pageable);

        @Query("SELECT r FROM Reservation r WHERE r.room.hotel.id = :hotelId")
        List<Reservation> findAllByHotelId(@Param("hotelId") Long hotelId);

        Page<Reservation> findAllByUserUserId(Long userId, Pageable pageable);

        @Query("SELECT r FROM Reservation r WHERE r.room.roomId = :roomId "
                        + "AND r.checkOutDate > :checkInDate "
                        + "AND r.checkInDate < :checkOutDate "
                        + "AND r.status NOT IN (com.hotelos.hotelosbackend.models.ReservationStatus.CANCELLED, com.hotelos.hotelosbackend.models.ReservationStatus.EXPIRED)")
        List<Reservation> findOverlappingReservations(@Param("roomId") Long roomId,
                        @Param("checkInDate") LocalDate checkInDate,
                        @Param("checkOutDate") LocalDate checkOutDate);

        @Query("SELECT r FROM Reservation r WHERE r.status = com.hotelos.hotelosbackend.models.ReservationStatus.PENDING AND r.checkOutDate < :today")
        List<Reservation> findPendingReservationsBefore(@Param("today") LocalDate today);

}