package com.hotelos.hotelosbackend;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest (classes = HotelOsBackendApplication.class)
@Transactional
class HotelRepositoryTest {

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testCreateAndFindHotel() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel.setAddress("123 Test St");
        hotel.setCity("Test City");
        hotel.setState("Test State");
        hotel.setZipCode("12345");
        hotel.setCountry("Test Country");

        Hotel savedHotel = hotelRepository.save(hotel);
        Optional<Hotel> foundHotel = hotelRepository.findById(savedHotel.getId());

        assertThat(foundHotel).isPresent();
        assertThat(foundHotel.get().getName()).isEqualTo("Hotel Test");
    }

    @Test
    void testUpdateHotel() {
        Hotel hotel = new Hotel();
        hotel.setName("Old Name");
        hotel = hotelRepository.save(hotel);

        hotel.setName("New Name");
        Hotel updatedHotel = hotelRepository.save(hotel);

        assertThat(updatedHotel.getName()).isEqualTo("New Name");
    }

    @Test
    void testDeleteHotel() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel to be deleted");
        hotel = hotelRepository.save(hotel);

        hotelRepository.delete(hotel);
        Optional<Hotel> foundHotel = hotelRepository.findById(hotel.getId());

        assertThat(foundHotel).isNotPresent();
    }
}