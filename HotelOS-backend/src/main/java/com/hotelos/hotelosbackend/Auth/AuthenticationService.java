package com.hotelos.hotelosbackend.Auth;

import com.hotelos.hotelosbackend.implementation.IJWTServices;
import com.hotelos.hotelosbackend.models.User;
import com.hotelos.hotelosbackend.models.UserType;
import com.hotelos.hotelosbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IJWTServices jwtServices;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserType(UserType.GUEST);
        userRepository.save(user);
        var jwtToken = jwtServices.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var email = jwtServices.extractUsername(request.getToken());
        var user = userRepository.findByEmail(email).orElseThrow();

        if(!jwtServices.isTokenValid(request.getToken(), user)) {
            throw new RuntimeException("Invalid token");
        }
        return AuthenticationResponse.builder().token(request.getToken()).user(user).build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtServices.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).user(user).build();
    }


}
