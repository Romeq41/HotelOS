package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.services.RoomServices;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/{id}/image_upload")
    public ResponseEntity<String> uploadRoomImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            String filePath = roomServices.storeFile(file);

            if (filePath == null || filePath.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            Room room = roomServices.getRoomById(id).orElseThrow(() -> new RuntimeException("Room not found"));
            room.setImagePath(filePath);

            roomServices.saveRoom(room);
            return ResponseEntity.ok("File uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<String> getRoomImage(@PathVariable Long id, HttpServletResponse response) {
        try {
            Room room = roomServices.getRoomById(id).orElseThrow(() -> new RuntimeException("Room not found"));
            if (room.getImagePath() == null || room.getImagePath().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            byte[] image = roomServices.getFile(room.getImagePath());
            if (image == null || image.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            response.setContentType(MediaType.IMAGE_JPEG_VALUE);
            StreamUtils.copy(image, response.getOutputStream());

            return ResponseEntity.ok(new String(image));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
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
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
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