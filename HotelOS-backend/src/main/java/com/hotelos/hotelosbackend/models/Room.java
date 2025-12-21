package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rooms", schema = "public", catalog = "HotelOS")
public class Room {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "room_id")
    private long roomId;

    @Basic
    @NotNull
    @Column(name = "room_number")
    private long roomNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @Basic
    @Column(name = "capacity")
    private Integer capacity;

    @Basic
    @Column(name = "price_modifier")
    private BigDecimal priceModifier;

    @Basic
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "image_path")
    private String imagePath;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Room room = (Room) o;
        return roomId == room.roomId &&
                Objects.equals(hotel, room.hotel) &&
                Objects.equals(roomNumber, room.roomNumber) &&
                (roomType == null ? room.roomType == null :
                        roomType.getId() != null && roomType.getId().equals(room.getRoomType() != null ? room.getRoomType().getId() : null)) &&
                Objects.equals(capacity, room.capacity) &&
                Objects.equals(priceModifier, room.priceModifier) &&
                Objects.equals(status, room.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId, hotel, roomNumber,
                roomType != null ? roomType.getId() : null,
                capacity, priceModifier, status);
    }
}