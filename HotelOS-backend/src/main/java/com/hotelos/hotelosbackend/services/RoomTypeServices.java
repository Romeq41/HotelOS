package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.dto.RoomTypeDto;
import com.hotelos.hotelosbackend.models.RoomType;

import java.util.List;

public interface RoomTypeServices {
    List<RoomTypeDto> getAllRoomTypes(boolean includeInactive);

    List<RoomTypeDto> getRoomTypesForHotel(Long hotelId, boolean includeInactive);

    RoomTypeDto getRoomTypeById(Long id);

    RoomTypeDto createRoomType(RoomTypeDto roomTypeDto);

    RoomTypeDto updateRoomType(Long id, RoomTypeDto roomTypeDetails);

    RoomTypeDto setRoomTypeActiveStatus(Long id, boolean active);

    void deleteRoomType(Long id);
}