package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payments", schema = "public", catalog = "HotelOS")
public class Payment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "payment_id")
    private long paymentId;
    @Basic
    @Column(name = "reservation_id")
    private long reservationId;
    @Basic
    @Column(name = "payment_date")
    private Date paymentDate;
    @Basic
    @Column(name = "amount")
    private BigDecimal amount;
    @Basic
    @Column(name = "method")
    private String method;
    @Basic
    @Column(name = "status")
    private String status;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return paymentId == payment.paymentId && Objects.equals(reservationId, payment.reservationId) && Objects.equals(paymentDate, payment.paymentDate) && Objects.equals(amount, payment.amount) && Objects.equals(method, payment.method) && Objects.equals(status, payment.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(paymentId, reservationId, paymentDate, amount, method, status);
    }
}
