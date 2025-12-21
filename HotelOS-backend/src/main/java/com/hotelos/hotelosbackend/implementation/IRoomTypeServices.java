package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.dto.RoomTypeDto;
import com.hotelos.hotelosbackend.mapper.RoomTypeMapper;
import com.hotelos.hotelosbackend.models.RoomType;
import com.hotelos.hotelosbackend.repository.RoomTypeRepository;
import com.hotelos.hotelosbackend.services.RoomTypeServices;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class IRoomTypeServices implements RoomTypeServices {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private RoomTypeMapper roomTypeMapper;

    @Override
    public List<RoomTypeDto> getAllRoomTypes(boolean includeInactive) {
        List<RoomType> roomTypes;
        if (includeInactive) {
            roomTypes = roomTypeRepository.findAll();
        } else {
            roomTypes = roomTypeRepository.findAllByisActiveTrue();
        }
        return roomTypes.stream().map(roomTypeMapper::toDto).toList();
    }

    @Override
    public List<RoomTypeDto> getRoomTypesForHotel(Long hotelId, boolean includeInactive) {
        List<RoomType> roomTypes;
        if (includeInactive) {
            roomTypes = roomTypeRepository.findByHotelIdOrHotelIsNull(hotelId);
        } else {
            roomTypes = roomTypeRepository.findByisActiveTrueAndHotelIdOrHotelIsNull(hotelId);
        }
        return roomTypes.stream().map(roomTypeMapper::toDto).toList();
    }

    @Override
    public RoomTypeDto getRoomTypeById(Long id) {
        return roomTypeRepository.findById(id)
                .map(roomTypeMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Room Type not found"));
    }

    @Override
    public RoomTypeDto createRoomType(RoomTypeDto roomTypeDto) {
        RoomType roomType = roomTypeMapper.toEntity(roomTypeDto);
        RoomType savedRoomType = roomTypeRepository.save(roomType);
        return roomTypeMapper.toDto(savedRoomType);
    }

    @Override
    public RoomTypeDto updateRoomType(Long id, RoomTypeDto roomTypeDto) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room Type not found"));

        roomType.setName(roomTypeDto.getName());
        roomType.setPriceFactor(roomTypeDto.getPriceFactor());
        roomType.setDescription(roomTypeDto.getDescription());
        roomType.setActive(roomTypeDto.isActive());
        if (roomTypeDto.getHotelId() != null) {
            // You'll need to handle the hotel reference here
            // This is a simplified version
            roomType.setHotel(null); // Set proper hotel reference
        }

        RoomType updatedRoomType = roomTypeRepository.save(roomType);
        return roomTypeMapper.toDto(updatedRoomType);
    }

    @Override
    public RoomTypeDto setRoomTypeActiveStatus(Long id, boolean active) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room Type not found"));
        roomType.setActive(active);
        RoomType updatedRoomType = roomTypeRepository.save(roomType);
        return roomTypeMapper.toDto(updatedRoomType);
    }

    @Override
    public void deleteRoomType(Long id) {
        if (!roomTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room Type not found");
        }
        // You might want to check if this room type is in use before deleting
        roomTypeRepository.deleteById(id);
    }

    @PostConstruct
    public void seedDefaultRoomTypes() {
        if (roomTypeRepository.count() == 0) {
            createRoomType(new RoomTypeDto(null, "STANDARD", 1.0, "Standard room", null, true, null, null));
            createRoomType(new RoomTypeDto(null, "FAMILY", 1.5, "Family room", null, true, null, null));
            createRoomType(new RoomTypeDto(null, "SUITE", 2.0, "Suite room", null, true, null, null));
            createRoomType(new RoomTypeDto(null, "PRESIDENTIAL_SUITE", 3.0, "Presidential suite", null, true, null, null));
            createRoomType(new RoomTypeDto(null, "FAMILY_ROOM", 1.8, "Family room with additional amenities", null, true, null, null));
        }
    }
}