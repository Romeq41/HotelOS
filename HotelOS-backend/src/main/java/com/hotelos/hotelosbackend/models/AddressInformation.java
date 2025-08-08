package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "address_information", schema = "public", catalog = "HotelOS")
public class AddressInformation {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "address_id")
    private long id;

    @Basic
    @Column(name = "address")
    private String address;

    @Basic
    @Column(name = "city")
    private String city;

    @Basic
    @Column(name = "state")
    private String state;

    @Basic
    @Column(name = "zip_code")
    private String zipCode;

    @Basic
    @Column(name = "country")
    private String country;

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
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AddressInformation that = (AddressInformation) o;
        return id == that.id && Objects.equals(address, that.address) && Objects.equals(city, that.city) && Objects.equals(state, that.state) && Objects.equals(zipCode, that.zipCode) && Objects.equals(country, that.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, address, city, state, zipCode, country);
    }
}
