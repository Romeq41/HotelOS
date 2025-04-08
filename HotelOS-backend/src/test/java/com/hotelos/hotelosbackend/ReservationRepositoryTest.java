package com.hotelos.hotelosbackend;

import com.hotelos.hotelosbackend.models.*;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import com.hotelos.hotelosbackend.repository.ReservationRepository;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import com.hotelos.hotelosbackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = HotelOsBackendApplication.class)
@Transactional
class ReservationRepositoryTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testCreateAndFindReservation() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setGuest(user);
        reservation.setRoom(room);
        reservation.setCheckInDate(Date.valueOf(LocalDate.now()));
        reservation.setCheckOutDate(Date.valueOf(LocalDate.now().plusDays(1)));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setTotalAmount(BigDecimal.valueOf(100.00));

        Reservation savedReservation = reservationRepository.save(reservation);
        Optional<Reservation> foundReservation = reservationRepository.findById(savedReservation.getReservationId());

        assertThat(foundReservation).isPresent();
        assertThat(foundReservation.get().getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    void testUpdateReservation() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        User guest = new User();
        guest.setFirstName("John");
        guest.setLastName("Doe");
        guest = userRepository.save(guest);

        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setRoom(room);
        reservation.setCheckInDate(Date.valueOf(LocalDate.now()));
        reservation.setCheckOutDate(Date.valueOf(LocalDate.now().plusDays(1)));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation = reservationRepository.save(reservation);

        reservation.setStatus(ReservationStatus.CHECKED_IN);
        Reservation updatedReservation = reservationRepository.save(reservation);

        assertThat(updatedReservation.getStatus()).isEqualTo(ReservationStatus.CHECKED_IN);
    }

    @Test
    void testDeleteReservation() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        User guest = new User();
        guest.setFirstName("John");
        guest.setLastName("Doe");
        guest = userRepository.save(guest);

        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setRoom(room);
        reservation.setCheckInDate(Date.valueOf(LocalDate.now()));
        reservation.setCheckOutDate(Date.valueOf(LocalDate.now().plusDays(1)));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation = reservationRepository.save(reservation);

        reservationRepository.delete(reservation);
        Optional<Reservation> foundReservation = reservationRepository.findById(reservation.getReservationId());

        assertThat(foundReservation).isNotPresent();
    }
}