package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.services.RoomServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomServices roomServices;

    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        Room savedRoom = roomServices.saveRoom(room);
        return ResponseEntity.ok(savedRoom);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomServices.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomServices.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{id}")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long id) {
        List<Room> rooms = roomServices.getRoomsByHotel(id);
        return ResponseEntity.ok(rooms);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom( @PathVariable Long id, @RequestBody Room room) {
        return roomServices.getRoomById(id)
                .map(roomObj -> {
                    roomObj.setRoomNumber(room.getRoomNumber());
                    roomObj.setType(room.getType());
                    roomObj.setRate(room.getRate());
                    roomObj.setStatus(room.getStatus());
                    roomObj.setHotelId(room.getHotelId());
                    roomObj.setDescription(room.getDescription());
                    Room updatedRoom = roomServices.saveRoom(room);
                    return ResponseEntity.ok(updatedRoom);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomServices.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}