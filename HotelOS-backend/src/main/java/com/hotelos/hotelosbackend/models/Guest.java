package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;


@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "guests", schema = "public", catalog = "HotelOS")
public class Guest {
    @Id
    @Column(name = "guest_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long guestId;
    @Basic
    @Column(name = "first_name")
    private String firstName;
    @Basic
    @Column(name = "last_name")
    private String lastName;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "phone")
    private String phone;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Guest guest = (Guest) o;
        return guestId == guest.guestId && Objects.equals(firstName, guest.firstName) && Objects.equals(lastName, guest.lastName) && Objects.equals(email, guest.email) && Objects.equals(phone, guest.phone) && Objects.equals(address, guest.address) && Objects.equals(city, guest.city) && Objects.equals(state, guest.state) && Objects.equals(zipCode, guest.zipCode) && Objects.equals(country, guest.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(guestId, firstName, lastName, email, phone, address, city, state, zipCode, country);
    }

}
