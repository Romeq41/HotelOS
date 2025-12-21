package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.RoomTypeDto;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.RoomType;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;

@Mapper(componentModel = "spring")
public abstract class RoomTypeMapper {

    @Autowired
    protected HotelRepository hotelRepository;

    @Mapping(target = "hotelId", source = "hotel.id")
    public abstract RoomTypeDto toDto(RoomType roomType);

    @Mapping(target = "hotel", expression = "java(mapHotel(dto.getHotelId()))")
    public abstract RoomType toEntity(RoomTypeDto dto);

    protected Hotel mapHotel(Long hotelId) {
        if (hotelId == null) {
            return null;
        }
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateRoomTypeFromDto(RoomTypeDto dto, @MappingTarget RoomType entity);
}