package com.hotelos.hotelosbackend;

import com.hotelos.hotelosbackend.models.Payment;
import com.hotelos.hotelosbackend.models.Reservation;
import com.hotelos.hotelosbackend.repository.PaymentRepository;
import com.hotelos.hotelosbackend.repository.ReservationRepository;
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
class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    void testCreateAndFindPayment() {
        Reservation reservation = new Reservation();
        reservation.setCheckInDate(Date.valueOf(LocalDate.now()));
        reservation.setCheckOutDate(Date.valueOf(LocalDate.now().plusDays(1)));
        reservation = reservationRepository.save(reservation);

        Payment payment = new Payment();
        payment.setReservationId(reservation.getReservationId());
        payment.setPaymentDate(Date.valueOf(LocalDate.now()));
        payment.setAmount(BigDecimal.valueOf(100.00));
        payment.setMethod("Credit Card");
        payment.setStatus("Completed");

        Payment savedPayment = paymentRepository.save(payment);
        Optional<Payment> foundPayment = paymentRepository.findById(savedPayment.getPaymentId());

        assertThat(foundPayment).isPresent();
        assertThat(foundPayment.get().getAmount()).isEqualTo(BigDecimal.valueOf(100.00));
    }

    @Test
    void testUpdatePayment() {
        Reservation reservation = new Reservation();
        reservation.setCheckInDate(Date.valueOf(LocalDate.now()));
        reservation.setCheckOutDate(Date.valueOf(LocalDate.now().plusDays(1)));
        reservation = reservationRepository.save(reservation);

        Payment payment = new Payment();
        payment.setReservationId(reservation.getReservationId());
        payment.setPaymentDate(Date.valueOf(LocalDate.now()));
        payment.setAmount(BigDecimal.valueOf(100.00));
        payment = paymentRepository.save(payment);

        payment.setAmount(BigDecimal.valueOf(150.00));
        Payment updatedPayment = paymentRepository.save(payment);

        assertThat(updatedPayment.getAmount()).isEqualTo(BigDecimal.valueOf(150.00));
    }

    @Test
    void testDeletePayment() {
        Reservation reservation = new Reservation();
        reservation.setCheckInDate(Date.valueOf(LocalDate.now()));
        reservation.setCheckOutDate(Date.valueOf(LocalDate.now().plusDays(1)));
        reservation = reservationRepository.save(reservation);

        Payment payment = new Payment();
        payment.setReservationId(reservation.getReservationId());
        payment.setPaymentDate(Date.valueOf(LocalDate.now()));
        payment.setAmount(BigDecimal.valueOf(100.00));
        payment = paymentRepository.save(payment);

        paymentRepository.delete(payment);
        Optional<Payment> foundPayment = paymentRepository.findById(payment.getPaymentId());

        assertThat(foundPayment).isNotPresent();
    }
}