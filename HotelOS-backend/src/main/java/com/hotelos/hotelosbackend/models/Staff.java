package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Staff {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "staff_id")
    private long staffId;
    @Basic
    @Column(name = "hotel_id")
    private long hotelId;
    @Basic
    @Column(name = "first_name")
    private String firstName;
    @Basic
    @Column(name = "last_name")
    private String lastName;
    @Basic
    @Column(name = "position")
    private String position;
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
        Staff staff = (Staff) o;
        return staffId == staff.staffId && Objects.equals(hotelId, staff.hotelId) && Objects.equals(firstName, staff.firstName) && Objects.equals(lastName, staff.lastName) && Objects.equals(position, staff.position) && Objects.equals(email, staff.email) && Objects.equals(phone, staff.phone) && Objects.equals(address, staff.address) && Objects.equals(city, staff.city) && Objects.equals(state, staff.state) && Objects.equals(zipCode, staff.zipCode) && Objects.equals(country, staff.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(staffId, hotelId, firstName, lastName, position, email, phone, address, city, state, zipCode, country);
    }
}
