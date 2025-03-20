package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Guest;
import com.hotelos.hotelosbackend.repository.GuestRepository;
import com.hotelos.hotelosbackend.services.GuestServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IGuestServices implements GuestServices {
    private final GuestRepository guestRepository;

    public IGuestServices(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public Guest saveGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    @Override
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    @Override
    public Optional<Guest> getGuestById(Long id) {
        return guestRepository.findById(id);
    }

    @Override
    public void deleteGuest(Long id) {
        guestRepository.deleteById(id);
    }
}