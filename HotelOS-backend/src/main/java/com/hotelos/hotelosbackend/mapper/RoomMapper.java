package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.models.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "hotel", source = "hotel")
    RoomDto toDto(Room room);

    @Mapping(target = "hotel", source = "hotel")
    Room toEntity(RoomDto roomDto);

}