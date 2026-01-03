package com.hotelos.hotelosbackend.Auth;

import com.hotelos.hotelosbackend.implementation.IJWTServices;
import com.hotelos.hotelosbackend.mail.EmailService;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import com.hotelos.hotelosbackend.repository.HotelRepository;
import com.hotelos.hotelosbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final PasswordEncoder passwordEncoder;
    private final IJWTServices jwtServices;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    private String normalizeEmail(String raw) {
        if (raw == null)
            return null;
        return raw.trim().toLowerCase();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        userRepository.findByEmail(email).ifPresent(u -> {
            throw new IllegalStateException("Email already registered");
        });

        var user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserType(UserType.GUEST);

        if (request.getHotelId() != null) {
            Hotel hotel = hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            user.setHotel(hotel);
        }

        userRepository.save(user);
        var jwtToken = jwtServices.generateToken(user);
        if (user.getEmail() != null) {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        }
        return AuthenticationResponse.builder().token(jwtToken).user(user).build();
    }

    public void changePassword(PasswordChangeRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserType() == UserType.ADMIN) {
            throw new RuntimeException("User not found");
        }

        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(email, request.getCurrentPassword()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        if (user.getEmail() != null) {
            emailService.sendPasswordChanged(user.getEmail(), user.getFirstName());
        }
    }

    public String initiateResetToken(String emailRaw) {
        String email = normalizeEmail(emailRaw);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserType() == UserType.ADMIN) {
            throw new RuntimeException("User not found");
        }

        String token = jwtServices.generateResetToken(email, 1000 * 60 * 15); // 15 minutes
        if (user.getEmail() != null) {
            emailService.sendPasswordResetToken(user.getEmail(), token);
        }
        return token;
    }

    public void confirmResetToken(String token, String newPassword) {
        if (!jwtServices.isResetTokenValid(token)) {
            throw new RuntimeException("Invalid or expired reset token");
        }
        String email = jwtServices.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserType() == UserType.ADMIN) {
            throw new RuntimeException("User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        if (user.getEmail() != null) {
            emailService.sendPasswordChanged(user.getEmail(), user.getFirstName());
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var email = jwtServices.extractUsername(request.getToken());
        var user = userRepository.findByEmail(email).orElseThrow();

        if (!jwtServices.isTokenValid(request.getToken(), user)) {
            throw new RuntimeException("Invalid token");
        }
        return AuthenticationResponse.builder().token(request.getToken()).user(user).build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtServices.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).user(user).build();
    }

}
