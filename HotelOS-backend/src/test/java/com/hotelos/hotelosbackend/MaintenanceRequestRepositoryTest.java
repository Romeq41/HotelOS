package com.hotelos.hotelosbackend;

import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.MaintenanceRequest;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import com.hotelos.hotelosbackend.repository.MaintenanceRequestRepository;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = HotelOsBackendApplication.class)
@Transactional
class MaintenanceRequestRepositoryTest {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testCreateAndFindMaintenanceRequest() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setRoomId(room.getRoomId());
        maintenanceRequest.setRequestDate(Date.valueOf(LocalDate.now()));
        maintenanceRequest.setDescription("Fix the AC");
        maintenanceRequest.setStatus("Pending");

        MaintenanceRequest savedMaintenanceRequest = maintenanceRequestRepository.save(maintenanceRequest);
        Optional<MaintenanceRequest> foundMaintenanceRequest = maintenanceRequestRepository.findById(savedMaintenanceRequest.getRequestId());

        assertThat(foundMaintenanceRequest).isPresent();
        assertThat(foundMaintenanceRequest.get().getDescription()).isEqualTo("Fix the AC");
    }

    @Test
    void testUpdateMaintenanceRequest() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setRoomId(room.getRoomId());
        maintenanceRequest.setRequestDate(Date.valueOf(LocalDate.now()));
        maintenanceRequest.setDescription("Fix the AC");
        maintenanceRequest = maintenanceRequestRepository.save(maintenanceRequest);

        maintenanceRequest.setStatus("Completed");
        MaintenanceRequest updatedMaintenanceRequest = maintenanceRequestRepository.save(maintenanceRequest);

        assertThat(updatedMaintenanceRequest.getStatus()).isEqualTo("Completed");
    }

    @Test
    void testDeleteMaintenanceRequest() {
        Hotel hotel = new Hotel();
        hotel.setName("Hotel Test");
        hotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setHotelId(hotel.getId());
        room.setRoomNumber("101");
        room = roomRepository.save(room);

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setRoomId(room.getRoomId());
        maintenanceRequest.setRequestDate(Date.valueOf(LocalDate.now()));
        maintenanceRequest.setDescription("Fix the AC");
        maintenanceRequest = maintenanceRequestRepository.save(maintenanceRequest);

        maintenanceRequestRepository.delete(maintenanceRequest);
        Optional<MaintenanceRequest> foundMaintenanceRequest = maintenanceRequestRepository.findById(maintenanceRequest.getRequestId());

        assertThat(foundMaintenanceRequest).isNotPresent();
    }
}