package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;

import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "hotels", schema = "public", catalog = "HotelOS")
public class Hotel {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "hotel_id")
    private long id;
    @Basic
    @Column(name = "name")
    private String name;
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
    @Column(name = "zipCode")
    private String zipCode;
    @Basic
    @Column(name = "country")
    private String country;
    @Basic
    @Column(name = "image_path")
    private String imagePath;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Hotel hotel = (Hotel) o;
        return id == hotel.id && Objects.equals(name, hotel.name) && Objects.equals(address, hotel.address) && Objects.equals(city, hotel.city) && Objects.equals(state, hotel.state) && Objects.equals(zipCode, hotel.zipCode) && Objects.equals(country, hotel.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, address, city, state, zipCode, country);
    }
}
