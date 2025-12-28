package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.repository.ReservationRepository;
import com.hotelos.hotelosbackend.services.ReservationServices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IReservationServices implements ReservationServices {
    private final ReservationRepository reservationRepository;

    public IReservationServices(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public Reservation updateReservation(Reservation reservation) {
        if (!reservationRepository.existsById(reservation.getReservationId())) {
            throw new IllegalArgumentException(
                    "Reservation with ID " + reservation.getReservationId() + " does not exist.");
        }
        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation saveReservation(Reservation reservation) {
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                reservation.getRoom().getRoomId(), reservation.getCheckInDate(), reservation.getCheckOutDate());

        if (!overlappingReservations.isEmpty()) {
            throw new IllegalArgumentException("The room is already reserved for the selected dates.");
        }

        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAllReservationsByHotelId(Long hotelId) {
        expirePastPendingReservations();
        return reservationRepository.findAllByHotelId(hotelId);
    }

    @Override
    public Page<Reservation> getReservationsByUser(Long userId, Pageable pageable) {
        expirePastPendingReservations();
        return reservationRepository.findAllByUserUserId(userId, pageable);
    }

    @Override
    public Page<Reservation> getReservationsWithFilters(Long hotelId, String reservationName, Pageable pageable) {
        expirePastPendingReservations();
        Optional<String> reservationNameOptional = Optional.ofNullable(reservationName);

        if (reservationNameOptional.isPresent()) {
            return reservationRepository.findByReservationNameContainsIgnoreCaseAndRoomHotelId(reservationName, hotelId,
                    pageable);
        }

        return reservationRepository.findAllByRoomHotelId(hotelId, pageable);
    }

    @Override
    public List<Reservation> getAllReservations() {
        expirePastPendingReservations();
        return reservationRepository.findAll();
    }

    @Override
    public Optional<Reservation> getReservationById(Long id) {
        expirePastPendingReservations();
        return reservationRepository.findById(id);
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    private void expirePastPendingReservations() {
        LocalDate today = LocalDate.now();
        List<Reservation> overdue = reservationRepository.findPendingReservationsBefore(today);
        if (overdue.isEmpty())
            return;

        overdue.forEach(r -> r.setStatus(com.hotelos.hotelosbackend.models.ReservationStatus.EXPIRED));
        reservationRepository.saveAll(overdue);
    }
}