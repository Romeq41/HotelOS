package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.services.ReservationServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationServices reservationServices;

    @PostMapping
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) {

        System.out.println(reservation);
        Reservation savedReservation = reservationServices.saveReservation(reservation);
        return ResponseEntity.ok(savedReservation);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationServices.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return reservationServices.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        return reservationServices.getReservationById(id)
                .map(existingReservation -> {
                    reservation.setReservationId(id);
                    Reservation updatedReservation = reservationServices.saveReservation(reservation);
                    return ResponseEntity.ok(updatedReservation);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Reservation>> getAllReservationsByHotelId(@PathVariable Long hotelId) {
        List<Reservation> reservations = reservationServices.getAllReservationsByHotelId(hotelId);
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationServices.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}