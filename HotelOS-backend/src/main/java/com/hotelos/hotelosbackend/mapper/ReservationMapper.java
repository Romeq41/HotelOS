package com.hotelos.hotelosbackend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.hotelos.hotelosbackend.dto.ReservationDto;
import com.hotelos.hotelosbackend.models.Reservation;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    @Mapping(source = "user", target = "user")
    @Mapping(source = "room", target = "room")
    ReservationDto toDto(Reservation reservation);
    
    @Mapping(target = "user", source = "user")
    @Mapping(target = "room", source = "room")
    Reservation toEntity(ReservationDto reservationDto);
}