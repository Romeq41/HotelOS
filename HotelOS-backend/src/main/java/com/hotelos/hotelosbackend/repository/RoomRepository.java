package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelId(Long hotelId);
}
