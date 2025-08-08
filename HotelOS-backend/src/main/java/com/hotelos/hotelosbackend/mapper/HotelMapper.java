package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.HotelDto;
import com.hotelos.hotelosbackend.dto.HotelOfferDto;
import com.hotelos.hotelosbackend.models.Hotel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelMapper {
    HotelDto toDto(Hotel hotel);

    Hotel toEntity(HotelDto hotelDto);

    HotelOfferDto toOfferDto(Hotel hotel);
}