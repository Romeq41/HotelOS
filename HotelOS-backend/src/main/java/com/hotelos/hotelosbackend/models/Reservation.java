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
@Table(name = "reservations", schema = "public", catalog = "HotelOS")
public class Reservation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "reservation_id")
    private long reservationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User guest;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Basic
    @Column(name = "check_in_date")
    private Date checkInDate;

    @Basic
    @Column(name = "check_out_date")
    private Date checkOutDate;

    @Basic
    @Column(name = "status")
    private String status;

    @Basic
    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reservation that = (Reservation) o;
        return reservationId == that.reservationId && Objects.equals(guest, that.guest) && Objects.equals(room, that.room) && Objects.equals(checkInDate, that.checkInDate) && Objects.equals(checkOutDate, that.checkOutDate) && Objects.equals(status, that.status) && Objects.equals(totalAmount, that.totalAmount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reservationId, guest, room, checkInDate, checkOutDate, status, totalAmount);
    }
}