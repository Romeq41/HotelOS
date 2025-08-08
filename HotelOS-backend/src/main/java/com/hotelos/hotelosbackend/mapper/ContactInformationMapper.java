package com.hotelos.hotelosbackend.mapper;

import com.hotelos.hotelosbackend.dto.AddressInformationDto;
import com.hotelos.hotelosbackend.dto.AmenityDto;
import com.hotelos.hotelosbackend.dto.ContactInformationDto;
import com.hotelos.hotelosbackend.models.AddressInformation;
import com.hotelos.hotelosbackend.models.Amenity;
import com.hotelos.hotelosbackend.models.ContactInformation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ContactInformationMapper {
    ContactInformationDto toDto(ContactInformation contactInformation);
    ContactInformation toEntity(ContactInformationDto contactInformationDto);
}