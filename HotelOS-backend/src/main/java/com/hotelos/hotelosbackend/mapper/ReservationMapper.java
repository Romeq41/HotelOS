package com.hotelos.hotelosbackend.mapper;

import org.mapstruct.Mapper;

import com.hotelos.hotelosbackend.dto.ReservationDto;
import com.hotelos.hotelosbackend.models.Reservation;

@Mapper(componentModel = "spring", uses = { GuestMapper.class })
public interface ReservationMapper {
    ReservationDto toDto(Reservation reservation);

    Reservation toEntity(ReservationDto reservationDto);
}