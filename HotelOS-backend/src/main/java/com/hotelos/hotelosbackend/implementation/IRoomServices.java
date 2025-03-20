package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import com.hotelos.hotelosbackend.services.RoomServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IRoomServices implements RoomServices {
    private final RoomRepository roomRepository;

    public IRoomServices(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
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
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}