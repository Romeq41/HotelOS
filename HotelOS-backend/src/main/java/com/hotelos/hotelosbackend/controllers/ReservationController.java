package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.HotelDto;
import com.hotelos.hotelosbackend.dto.ReservationDto;
import com.hotelos.hotelosbackend.mapper.ReservationMapper;
import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.services.ReservationServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationServices reservationServices;

    @Autowired
    private ReservationMapper reservationMapper;

    @PostMapping
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) {

        System.out.println(reservation);
        Reservation savedReservation = reservationServices.saveReservation(reservation);
        return ResponseEntity.ok(savedReservation);
    }

//    @GetMapping
//    public ResponseEntity<Page<ReservationDto>> getAllReservations(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//
//            @RequestParam(required = false) String reservationName,
//            @RequestParam(required = false) Long roomNumber
//    ) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<ReservationDto> reservations = reservationServices.getReservationsWithFilters(reservationName, roomNumber, pageable).map(reservationMapper::toDto);
//        return ResponseEntity.ok(reservations);
//    }

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
    public ResponseEntity<Page<ReservationDto>> getAllReservationsByHotelId(
        @PathVariable Long hotelId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String reservationName
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationDto> reservations = reservationServices.getReservationsWithFilters(hotelId, reservationName, pageable).map(reservationMapper::toDto);
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationServices.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}