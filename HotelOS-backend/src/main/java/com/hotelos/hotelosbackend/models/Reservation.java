package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import org.springframework.cglib.core.Local;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

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
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Basic
    @Column(name = "reservation_name")
    private String reservationName;

    @Basic
    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @Basic
    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @Basic
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReservationStatus status;

    @Basic
    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "num_adults")
    private Integer numberOfAdults;

    @Column(name = "num_children")
    private Integer numberOfChildren;

    @Column(name = "special_requests", length = 500)
    private String specialRequests;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // In your Reservation class
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Guest> guests = new HashSet<>();

    // Keep primary guest information for quick access
    @Column(name = "primary_guest_name")
    private String primaryGuestName;

    @Column(name = "primary_guest_email")
    private String primaryGuestEmail;

    @Column(name = "primary_guest_phone")
    private String primaryGuestPhone;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reservation that = (Reservation) o;
        return reservationId == that.reservationId && Objects.equals(user, that.user) && Objects.equals(room, that.room) && Objects.equals(checkInDate, that.checkInDate) && Objects.equals(checkOutDate, that.checkOutDate) && Objects.equals(status, that.status) && Objects.equals(totalAmount, that.totalAmount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reservationId, user, room, checkInDate, checkOutDate, status, totalAmount);
    }
}