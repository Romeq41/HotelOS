package com.hotelos.hotelosbackend;

import com.hotelos.hotelosbackend.models.ContactInformation;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = HotelOsBackendApplication.class)
@Transactional
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testCreateAndFindGuest() {
        User guest = new User();
        guest.setFirstName("John");
        guest.setLastName("Doe");
        guest.setEmail("john.doe@example.com");

        ContactInformation contactInformation = new ContactInformation();

        contactInformation.setPhoneNumber("123-456-7890");

        guest.setContactInformation(contactInformation);

        User savedGuest = userRepository.save(guest);
        Optional<User> foundGuest = userRepository.findById(savedGuest.getUserId());

        assertThat(foundGuest).isPresent();
        assertThat(foundGuest.get().getFirstName()).isEqualTo("John");
    }

    @Test
    void testUpdateGuest() {
        User user = new User();
        user.setFirstName("Old Name");
        user = userRepository.save(user);

        user.setFirstName("New Name");
        User updatedGuest = userRepository.save(user);

        assertThat(updatedGuest.getFirstName()).isEqualTo("New Name");
    }

    @Test
    void testDeleteGuest() {
        User user = new User();
        user.setFirstName("Guest to be deleted");
        user = userRepository.save(user);

        userRepository.delete(user);
        Optional<User> foundGuest = userRepository.findById(user.getUserId());

        assertThat(foundGuest).isNotPresent();
    }
}