package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUserType(UserType userType);
    List<User> findByHotel(Hotel hotel);
    Page<User> findByHotelId(long id, Pageable pageable);
    Optional<User> findByEmail(String email);
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    Page<User> findByEmailContainingIgnoreCaseAndHotelId(String email, long hotelId, Pageable pageable);

    List<User> findByUserTypeAndHotelId(UserType userType, Long hotelId);


}