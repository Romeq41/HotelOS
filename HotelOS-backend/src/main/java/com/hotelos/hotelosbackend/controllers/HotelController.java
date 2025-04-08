package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.services.HotelServices;
import com.hotelos.hotelosbackend.services.RoomServices;
import com.hotelos.hotelosbackend.services.UserServices;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelServices hotelServices;

    @Autowired
    private UserServices userServices;

    @Autowired
    private RoomServices roomServices;

    @PostMapping
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {
        Hotel savedHotel = hotelServices.saveHotel(hotel);
        return ResponseEntity.ok(savedHotel);
    }

    @PostMapping("/{id}/image_upload")
    public ResponseEntity<String> uploadHotelImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            String filePath = hotelServices.storeFile(file);

            if (filePath == null || filePath.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            Hotel hotel = hotelServices.getHotelById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
            hotel.setImagePath(filePath);

            hotelServices.saveHotel(hotel);
            return ResponseEntity.ok("File uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<String> getRoomImage(@PathVariable Long id, HttpServletResponse response) {
        try {
            Hotel hotel = hotelServices.getHotelById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
            if (hotel.getImagePath() == null || hotel.getImagePath().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty or invalid");
            }

            byte[] image = hotelServices.getFile(hotel.getImagePath());
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
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> hotels = hotelServices.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelServices.getHotelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<List<User>> getUsersByHotelId(@PathVariable Long id) {
        System.out.println("Hotel ID: " + id);
        return hotelServices.getHotelById(id)
                .map(hotel -> {
                    System.out.println(hotel);
                    List<User> users = userServices.getUsersByHotel(hotel);
                    System.out.println("hello");
                    System.out.println(users);
                    return ResponseEntity.ok(users);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotelById(@RequestBody Hotel hotelDetails) {
        return hotelServices.getHotelById(hotelDetails.getId())
                .map(hotel -> {
                    hotel.setName(hotelDetails.getName());
                    hotel.setAddress(hotelDetails.getAddress());
                    hotel.setCity(hotelDetails.getCity());
                    hotel.setState(hotelDetails.getState());
                    hotel.setCountry(hotelDetails.getCountry());
                    hotel.setZipCode(hotelDetails.getZipCode());

                    Hotel updatedHotel = hotelServices.saveHotel(hotel);
                    return ResponseEntity.ok(updatedHotel);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelServices.getHotelById(id).ifPresent(hotel -> {
            userServices.getUsersByHotel(hotel).forEach(user -> {
                user.setHotel(null);
                userServices.updateUser(user);
            });

            roomServices.getRoomsByHotel(id).forEach(room -> {
                roomServices.deleteRoom(room.getRoomId());
            });
            hotelServices.deleteHotel(id);
        });
        return ResponseEntity.noContent().build();
    }
}