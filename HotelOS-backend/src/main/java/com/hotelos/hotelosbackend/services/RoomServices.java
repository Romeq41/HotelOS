package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.models.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface RoomServices {
    Room saveRoom(Room person);

    String storeFile(MultipartFile file) throws IOException;

    byte[] getFile(String filePath) throws IOException;

    Page<RoomDto> getAllRooms(Pageable pageable);

    Optional<Room> getRoomById(Long id);

    List<Room> getRoomsByHotel(Long id);

    Page<Room> getRoomsWithFilters(long hotel_id, Long roomNumber, Pageable pageable);

    void deleteRoom(Long id);
}
