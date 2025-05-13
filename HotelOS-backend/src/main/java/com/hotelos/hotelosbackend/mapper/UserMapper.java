package com.hotelos.hotelosbackend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.hotelos.hotelosbackend.dto.UserDto;
import com.hotelos.hotelosbackend.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "hotel", source = "hotel")
    UserDto toDto(User user);
    
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "hotel", source = "hotel")
    User toEntity(UserDto userDto);
}