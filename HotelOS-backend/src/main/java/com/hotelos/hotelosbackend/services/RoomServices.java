package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Room;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

public interface RoomServices {
    Room saveRoom(Room person);

    String storeFile(MultipartFile file) throws IOException;

    byte[] getFile(String filePath) throws IOException;

    List<Room> getAllRooms();

    Optional<Room> getRoomById(Long id);

    List<Room> getRoomsByHotel(Long id);

    void deleteRoom(Long id);
}
