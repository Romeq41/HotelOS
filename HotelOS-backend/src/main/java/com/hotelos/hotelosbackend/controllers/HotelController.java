package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.HotelDto;
import com.hotelos.hotelosbackend.dto.HotelStatisticsDto;
import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.dto.UserDto;
import com.hotelos.hotelosbackend.mapper.HotelMapper;
import com.hotelos.hotelosbackend.mapper.RoomMapper;
import com.hotelos.hotelosbackend.mapper.UserMapper;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.services.HotelServices;
import com.hotelos.hotelosbackend.services.RoomServices;
import com.hotelos.hotelosbackend.services.UserServices;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelServices hotelServices;

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoomServices roomServices;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private RoomMapper roomMapper;

    @PostMapping
    public ResponseEntity<HotelDto> addHotel(@Valid @RequestBody HotelDto hotelDto) {
        Hotel savedHotel = hotelServices.saveHotel(hotelMapper.toEntity(hotelDto));
        return ResponseEntity.ok(hotelMapper.toDto(savedHotel));
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
    public ResponseEntity<Page<HotelDto>> getAllHotels(@RequestParam(defaultValue = "0") @PositiveOrZero int page, @RequestParam(defaultValue = "10") @PositiveOrZero int size, @RequestParam(required = false) String name) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelDto> hotels = hotelServices.getHotelsWithFilters(name, pageable).map(hotelMapper::toDto);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelServices.getHotelById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<HotelStatisticsDto> getHotelStatistics(@PathVariable Long id) {
        return hotelServices.getHotelById(id).map(hotel -> {
            HotelStatisticsDto statistics = hotelServices.getHotelStatistics(hotel);
            return ResponseEntity.ok(statistics);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<Page<UserDto>> getUsersByHotelId(@PathVariable Long id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String email) {
        Pageable pageable = PageRequest.of(page, size);
        return hotelServices.getHotelById(id).map(hotel -> {
            System.out.println(hotel);
            Page<UserDto> users = userServices.getUsersWithFilters(email, id, pageable).map(userMapper::toDto);
            System.out.println("hello");
            System.out.println(users);
            return ResponseEntity.ok(users);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<Page<RoomDto>> getRoomsByHotelId(@PathVariable Long id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) Long roomNumber) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoomDto> rooms = roomServices.getRoomsWithFilters(id, roomNumber, pageable).map(roomMapper::toDto);
        return ResponseEntity.ok(rooms);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelDto> updateHotelById(@PathVariable Long id, @Valid @RequestBody HotelDto hotelDto) {
        return hotelServices.getHotelById(id).map(hotel -> {
            hotel.setName(hotelDto.getName());
            hotel.setAddress(hotelDto.getAddress());
            hotel.setCity(hotelDto.getCity());
            hotel.setState(hotelDto.getState());
            hotel.setCountry(hotelDto.getCountry());
            hotel.setZipCode(hotelDto.getZipCode());

            Hotel updatedHotel = hotelServices.saveHotel(hotel);
            return ResponseEntity.ok(hotelMapper.toDto(updatedHotel));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelServices.getHotelById(id).ifPresent(hotel -> {
            userServices.getUsersByHotel(hotel).forEach(user -> {
                user.setHotel(null);
                userServices.updateUser(user);
            });

            roomServices.getRoomsByHotel(id).forEach(room -> roomServices.deleteRoom(room.getRoomId()));
            hotelServices.deleteHotel(id);
        });
        return ResponseEntity.noContent().build();
    }
}