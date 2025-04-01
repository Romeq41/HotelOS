package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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
    @Column(name = "hotel_id")
    private long hotelId;
    @Basic
    @Column(name = "room_number")
    private String roomNumber;
    @Basic
    @Column(name = "type")
    private String type;
    @Basic
    @Column(name = "capacity")
    private Integer capacity;
    @Basic
    @Column(name = "rate")
    private BigDecimal rate;

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Room room = (Room) o;
        return roomId == room.roomId && Objects.equals(hotelId, room.hotelId)
                && Objects.equals(roomNumber, room.roomNumber) && Objects.equals(type, room.type)
                && Objects.equals(capacity, room.capacity) && Objects.equals(rate, room.rate)
                && Objects.equals(status, room.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId, hotelId, roomNumber, type, capacity, rate, status);
    }
}
