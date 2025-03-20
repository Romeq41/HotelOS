package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.Guest;
import com.hotelos.hotelosbackend.services.GuestServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestServices guestServices;

    @PostMapping
    public ResponseEntity<Guest> addGuest(@RequestBody Guest guest) {
        Guest savedGuest = guestServices.saveGuest(guest);
        return ResponseEntity.ok(savedGuest);
    }

    @GetMapping
    public ResponseEntity<List<Guest>> getAllGuests() {
        List<Guest> guests = guestServices.getAllGuests();
        return ResponseEntity.ok(guests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        return guestServices.getGuestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        guestServices.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }
}