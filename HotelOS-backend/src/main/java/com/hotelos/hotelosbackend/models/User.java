package com.hotelos.hotelosbackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users", schema = "public", catalog = "HotelOS")
public class User implements UserDetails {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Basic
    @Column(name = "first_name")
    private String firstName;

    @Basic
    @Column(name = "last_name")
    private String lastName;

    @Basic
    @Column(name = "password")
    private String password;

    @Basic
    @Column(name = "email")
    private String email;

    @OneToOne
    @JoinColumn(name = "address_id")
    private AddressInformation addressInformation;

    @OneToOne
    @JoinColumn(name = "contact_id")
    private ContactInformation contactInformation;

    @Basic
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    @Basic
    @Column(name = "position")
    private String position;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Basic
    @Column(name = "image_path")
    private String imagePath;

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
        User user = (User) o;
        return userId == user.userId &&
                Objects.equals(firstName, user.firstName) &&
                Objects.equals(lastName, user.lastName) &&
                Objects.equals(password, user.password) &&
                Objects.equals(email, user.email) &&
                Objects.equals(addressInformation, user.addressInformation) &&
                Objects.equals(contactInformation, user.contactInformation) &&
                userType == user.userType &&
                Objects.equals(position, user.position) &&
                Objects.equals(hotel, user.hotel) &&
                Objects.equals(imagePath, user.imagePath);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, firstName, lastName, password, email, addressInformation, contactInformation, userType, position, hotel, imagePath);
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userType.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}