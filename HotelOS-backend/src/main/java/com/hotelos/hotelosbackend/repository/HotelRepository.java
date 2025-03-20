package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
