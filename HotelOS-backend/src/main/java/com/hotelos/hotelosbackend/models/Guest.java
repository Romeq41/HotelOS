package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "guests")
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column
    private String email;

    @Column
    private String phoneNumber;

    @Column
    private String idDocumentType; // Passport, ID card, etc.

    @Column
    private String idDocumentNumber;

    @Column
    private LocalDate dateOfBirth;

    @Column
    private String nationality;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User bookedBy; // Link to the user who made the booking (if any)

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @Column
    private Boolean isPrimaryGuest; // Main contact person for the reservation

    @Column
    private String specialRequirements;

    // Audit fields
    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}