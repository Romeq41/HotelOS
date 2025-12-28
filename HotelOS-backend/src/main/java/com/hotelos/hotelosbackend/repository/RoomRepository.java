package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.dto.CheapestRoomByTypeDto;
import com.hotelos.hotelosbackend.models.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.hotelos.hotelosbackend.models.RoomStatus;

import java.time.LocalDate;
import java.util.List;

@Repository

public interface RoomRepository extends JpaRepository<Room, Long> {

  Page<Room> findByRoomNumberAndHotelId(Long roomNumber, Long hotelId, Pageable pageable);

  List<Room> findAllByHotelId(Long hotelId);

  Page<Room> findByHotelId(Long hotelId, Pageable pageable);

  List<Room> findByRoomNumberAndHotel_Id(Long roomNumber, Long hotelId);

  boolean existsByRoomNumberAndHotel_Id(Long roomNumber, Long hotelId);

  Long countByHotelAndStatusEquals(Hotel hotel, RoomStatus status);

  Long countRoomsByHotelIdAndRoomType(Long hotelId, RoomType roomType);

  @Query("SELECT r FROM Reservation r WHERE r.room.roomId = :roomId " +
      "AND r.checkOutDate > :checkInDate " +
      "AND r.checkInDate < :checkOutDate")
  List<Reservation> findOverlappingReservationsLocalDate(@Param("roomId") Long roomId,
      @Param("checkInDate") LocalDate checkInDate,
      @Param("checkOutDate") LocalDate checkOutDate);

  @Query("""
      SELECT room FROM Room room
      WHERE room.hotel.id = :hotelId
        AND room.status = 'AVAILABLE'
        AND NOT EXISTS (
              SELECT res FROM Reservation res
              WHERE res.room = room
                AND res.checkOutDate > :checkIn
                AND res.checkInDate < :checkOut
                AND res.status NOT IN (
                      com.hotelos.hotelosbackend.models.ReservationStatus.CANCELLED,
                      com.hotelos.hotelosbackend.models.ReservationStatus.EXPIRED)
        )
      """)
  List<Room> findAvailableRoomsByHotelAndDates(@Param("hotelId") Long hotelId,
      @Param("checkIn") LocalDate checkIn,
      @Param("checkOut") LocalDate checkOut);
}
