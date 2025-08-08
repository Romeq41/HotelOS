package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.AmenityDto;
import com.hotelos.hotelosbackend.models.Amenity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AmenityMapper {
    AmenityDto toDto(Amenity amenity);

    Amenity toEntity(AmenityDto hotelDto);
}