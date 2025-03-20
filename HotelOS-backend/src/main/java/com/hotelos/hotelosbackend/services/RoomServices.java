package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Room;

import java.util.List;
import java.util.Optional;

;

public interface RoomServices {
    Room saveRoom(Room person);

    List<Room> getAllRooms();

    Optional<Room> getRoomById(Long id);

    void deleteRoom(Long id);
}
