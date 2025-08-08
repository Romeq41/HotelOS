package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.AddressInformationDto;
import com.hotelos.hotelosbackend.dto.AmenityDto;
import com.hotelos.hotelosbackend.models.AddressInformation;
import com.hotelos.hotelosbackend.models.Amenity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressInformationMapper {

    AddressInformationDto toDto(Amenity amenity);

    AddressInformation toEntity(AddressInformationDto addressInformationDto);
}