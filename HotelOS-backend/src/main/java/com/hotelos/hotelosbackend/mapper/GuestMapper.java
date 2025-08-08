package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.GuestDto;
import com.hotelos.hotelosbackend.models.Guest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GuestMapper {
    GuestDto toDto(Guest guest);

    Guest toEntity(GuestDto guestDto);
}