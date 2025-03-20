package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
}
