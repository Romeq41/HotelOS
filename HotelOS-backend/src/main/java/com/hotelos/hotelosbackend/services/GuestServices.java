package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Guest;

import java.util.List;
import java.util.Optional;

public interface GuestServices {
    Guest saveGuest(Guest person);

    List<Guest> getAllGuests();

    Optional<Guest> getGuestById(Long id);

    void deleteGuest(Long id);
}
