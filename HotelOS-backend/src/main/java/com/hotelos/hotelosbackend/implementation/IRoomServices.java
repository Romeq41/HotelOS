package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.mapper.RoomMapper;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import com.hotelos.hotelosbackend.services.FileStorageService;
import com.hotelos.hotelosbackend.services.RoomServices;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class IRoomServices implements RoomServices {
    private final RoomRepository roomRepository;

    private final FileStorageService fileStorageService;
    private final RoomMapper roomMapper;
    public IRoomServices(RoomRepository roomRepository, FileStorageService fileStorageService, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.fileStorageService = fileStorageService;
        this.roomMapper = roomMapper;
    }

    @Override
    public Room saveRoom(Room room) {
        boolean exists = roomRepository.existsByRoomNumberAndHotel_Id(room.getRoomNumber(), room.getHotel().getId());
        if (exists) {
            throw new IllegalArgumentException("Room number must be unique within the same hotel.");
        }
        return roomRepository.save(room);
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String imagePath = fileStorageService.storeFile(file, "rooms");

        if (imagePath == null || imagePath.isEmpty()) {
            throw new IOException("Failed to store file: " + file.getOriginalFilename());
        }
        return imagePath;
    }

    @Override
    public byte[] getFile(String filePath) throws IOException {
        return fileStorageService.getFile(filePath);
    }

    @Override
    public Page<RoomDto> getAllRooms(Pageable pageable) {
        return roomRepository.findAll(pageable)
                .map(roomMapper::toDto);
    }

    @Override
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    @Override
    public List<Room> getRoomsByHotel(Long id) {
        return roomRepository.findByHotelId(id);
    }

    @Override
    public Page<Room> getRoomsWithFilters(long hotel_id, Long roomNumber, Pageable pageable) {
        Optional<Long> roomOpt = Optional.ofNullable(roomNumber).filter(e -> e > 0);

        if(roomOpt.isPresent()) {
            return roomRepository.findByRoomNumberAndHotelId(roomNumber, hotel_id, pageable);
        } else {
            return roomRepository.findByHotelId(hotel_id, pageable);
        }
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}