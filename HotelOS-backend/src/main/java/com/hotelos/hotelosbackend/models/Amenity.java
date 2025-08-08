package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "amenities", schema = "public", catalog = "HotelOS")
public class Amenity {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "amenity_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Basic
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Basic
    @Column(name = "description", length = 500)
    private String description;

    @Basic
    @Column(name = "type", length = 50)
    private AmenityType type;

    @Basic
    @Column(name = "distance_km")
    private Double distanceKm; // Nullable, e.g., for nearby attractions

    @Basic
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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