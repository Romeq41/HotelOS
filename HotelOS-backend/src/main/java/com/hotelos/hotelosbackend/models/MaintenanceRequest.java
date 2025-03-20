package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "maintenance_requests", schema = "public", catalog = "HotelOS")
public class MaintenanceRequest {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "request_id")
    private long requestId;
    @Basic
    @Column(name = "room_id")
    private long roomId;
    @Basic
    @Column(name = "request_date")
    private Date requestDate;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "status")
    private String status;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MaintenanceRequest that = (MaintenanceRequest) o;
        return requestId == that.requestId && Objects.equals(roomId, that.roomId) && Objects.equals(requestDate, that.requestDate) && Objects.equals(description, that.description) && Objects.equals(status, that.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requestId, roomId, requestDate, description, status);
    }
}
