package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface RoomRepository extends JpaRepository<Room, Long> {
}
