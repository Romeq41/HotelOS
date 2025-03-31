package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.services.HotelServices;
import com.hotelos.hotelosbackend.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelServices hotelServices;

    @Autowired
    private UserServices userServices;

    @PostMapping
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {
        Hotel savedHotel = hotelServices.saveHotel(hotel);
        return ResponseEntity.ok(savedHotel);
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
            hotelServices.deleteHotel(id);
        });
        return ResponseEntity.noContent().build();
    }
}