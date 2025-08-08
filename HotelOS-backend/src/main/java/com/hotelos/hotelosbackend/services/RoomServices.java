package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.models.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    RoomDto getCheapestRoomByHotelId(Long id);
}
