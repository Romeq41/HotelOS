package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.ReservationDto;
import com.hotelos.hotelosbackend.mapper.ReservationMapper;
import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.services.ReservationServices;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationServices reservationServices;

    @Autowired
    private ReservationMapper reservationMapper;

    @PostMapping
    public ResponseEntity<ReservationDto> addReservation(@Valid @RequestBody ReservationDto reservationDto) {
        Reservation reservation = reservationMapper.toEntity(reservationDto);
        Reservation savedReservation = reservationServices.saveReservation(reservation);
        return ResponseEntity.ok(reservationMapper.toDto(savedReservation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto> getReservationById(
            @PathVariable @Positive(message = "ID must be a positive number") Long id) {
        return reservationServices.getReservationById(id)
                .map(reservation -> ResponseEntity.ok(reservationMapper.toDto(reservation)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDto> updateReservation(
            @PathVariable @Positive(message = "ID must be a positive number") Long id,
            @Valid @RequestBody ReservationDto reservationDto) {

        System.out.println("Updating reservation with ID: " + id);
        return reservationServices.getReservationById(id)
                .map(existingReservation -> {
                    Reservation reservation = reservationMapper.toEntity(reservationDto);
                    reservation.setReservationId(id);
                    Reservation updatedReservation = reservationServices.updateReservation(reservation);
                    return ResponseEntity.ok(reservationMapper.toDto(updatedReservation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Page<ReservationDto>> getAllReservationsByHotelId(
            @PathVariable @Positive Long hotelId,
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @Positive int size,
            @RequestParam(required = false) String reservationName) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationDto> reservations = reservationServices
                .getReservationsWithFilters(hotelId, reservationName, pageable)
                .map(reservationMapper::toDto);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ReservationDto>> getReservationsByUser(
            @PathVariable @Positive Long userId,
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @Positive int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationDto> reservations = reservationServices.getReservationsByUser(userId, pageable)
                .map(reservationMapper::toDto);
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(
            @PathVariable @Positive(message = "ID must be a positive number") Long id) {
        reservationServices.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}