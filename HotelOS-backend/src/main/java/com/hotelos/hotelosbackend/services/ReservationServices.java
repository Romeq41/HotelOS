package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Reservation;

import java.util.List;
import java.util.Optional;

public interface ReservationServices {
    Reservation saveReservation(Reservation person);

    List<Reservation> getAllReservations();

    Optional<Reservation> getReservationById(Long id);

    void deleteReservation(Long id);

    List<Reservation> getAllReservationsByHotelId(Long hotelId);
}
