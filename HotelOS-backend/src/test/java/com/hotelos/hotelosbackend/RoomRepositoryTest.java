package com.hotelos.hotelosbackend;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.models.RoomStatus;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest (classes = HotelOsBackendApplication.class)
@Transactional
class RoomRepositoryTest {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testCreateAndFindRoom() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room.setType("Standard");
        room.setCapacity(2);
        room.setRate(BigDecimal.valueOf(100.00));
        room.setStatus(RoomStatus.AVAILABLE);

        Room savedRoom = roomRepository.save(room);
        Optional<Room> foundRoom = roomRepository.findById(savedRoom.getRoomId());

        assertThat(foundRoom).isPresent();
        assertThat(foundRoom.get().getRoomNumber()).isEqualTo("101");
    }

    @Test
    void testUpdateRoom() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        room.setRoomNumber("102");
        Room updatedRoom = roomRepository.save(room);

        assertThat(updatedRoom.getRoomNumber()).isEqualTo("102");
    }

    @Test
    void testDeleteRoom() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        roomRepository.delete(room);
        Optional<Room> foundRoom = roomRepository.findById(room.getRoomId());

        assertThat(foundRoom).isNotPresent();
    }
}