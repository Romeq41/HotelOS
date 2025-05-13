package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.dto.ReservationDto;
import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.repository.ReservationRepository;
import com.hotelos.hotelosbackend.services.ReservationServices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class IReservationServices implements ReservationServices {
    private final ReservationRepository reservationRepository;

    public IReservationServices(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public Reservation saveReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAllReservationsByHotelId(Long hotelId) {
        return reservationRepository.findAllByHotelId(hotelId);
    }

    @Override
    public Page<Reservation> getReservationsWithFilters(Long hotelId, String reservationName, Pageable pageable) {
        Optional<String> reservationNameOptional = Optional.ofNullable(reservationName);

        if(reservationNameOptional.isPresent()) {
            return reservationRepository.findByReservationNameContainsIgnoreCaseAndRoomHotelId(reservationName, hotelId, pageable);
        }

        return reservationRepository.findAll(pageable);
    }


    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}