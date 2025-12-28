package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.dto.ReservationDto;
import com.hotelos.hotelosbackend.models.Reservation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ReservationServices {
    Reservation saveReservation(Reservation person);

    Reservation updateReservation(Reservation reservation);

    List<Reservation> getAllReservations();

    Optional<Reservation> getReservationById(Long id);

    Page<Reservation> getReservationsByUser(Long userId, Pageable pageable);

    void deleteReservation(Long id);

    List<Reservation> getAllReservationsByHotelId(Long hotelId);

    Page<Reservation> getReservationsWithFilters(Long hotelId, String reservationName, Pageable pageable);
}
