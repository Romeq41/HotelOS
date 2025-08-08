package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.services.PriceCalculationService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;

@Mapper(componentModel = "spring")
public abstract class RoomMapper {

    @Autowired
    protected PriceCalculationService priceCalculationService;

    @Mapping(target = "hotel", source = "hotel")
    public abstract RoomDto toDto(Room room);

    @AfterMapping
    protected void calculateDefaultPrice(Room room, @MappingTarget RoomDto dto) {
        if (room == null || dto == null) {
            return;
        }

        LocalDate today = LocalDate.now();
        // default 1-night stay
        dto.setPrice(priceCalculationService.calculateRoomPrice(room, today, today.plusDays(1)));
    }

    public RoomDto toDto(Room room, LocalDate checkIn, LocalDate checkOut) {
        if (room == null) {
            return null;
        }

        RoomDto dto = toDto(room);
        dto.setPrice(priceCalculationService.calculateRoomPrice(room, checkIn, checkOut));

        return dto;
    }

    @Mapping(target = "hotel", source = "hotel")
    public abstract Room toEntity(RoomDto roomDto);

    public Room toEntity(RoomDto roomDto, Hotel hotel) {
        if (roomDto == null) {
            return null;
        }

        Room room = toEntity(roomDto);
        room.setHotel(hotel);

        return room;
    }
}