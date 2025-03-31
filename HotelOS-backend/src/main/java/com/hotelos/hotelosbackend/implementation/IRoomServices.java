package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import com.hotelos.hotelosbackend.services.FileStorageService;
import com.hotelos.hotelosbackend.services.RoomServices;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class IRoomServices implements RoomServices {
    private final RoomRepository roomRepository;

    private final FileStorageService fileStorageService;

    public IRoomServices(RoomRepository roomRepository, FileStorageService fileStorageService) {
        this.roomRepository = roomRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public Room saveRoom(Room room) {
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
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
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
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}