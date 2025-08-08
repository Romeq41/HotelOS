package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.models.RoomStatus;
import com.hotelos.hotelosbackend.models.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface RoomRepository extends JpaRepository<Room, Long> {

    Page<Room> findByRoomNumberAndHotelId(Long roomNumber, Long hotelId, Pageable pageable);
    List<Room> findByHotelId(Long hotelId);
    Page<Room> findByHotelId(Long hotelId, Pageable pageable);

    boolean existsByRoomNumberAndHotel_Id(Long roomNumber, Long hotelId);
    Long countByHotelAndStatusEquals(Hotel hotel, RoomStatus status);
    Long countRoomsByHotelIdAndRoomType(Long hotelId, RoomType roomType);

}
