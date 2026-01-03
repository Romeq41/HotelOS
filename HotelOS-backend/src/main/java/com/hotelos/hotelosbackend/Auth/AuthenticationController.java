package com.hotelos.hotelosbackend.Auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (IllegalStateException e) {
            logger.warn("Registration rejected: {}", e.getMessage());
            return ResponseEntity.status(409).build();
        } catch (IllegalArgumentException e) {
            logger.warn("Registration invalid: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error while registering user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/reset-password/request")
    public ResponseEntity<String> requestReset(@Valid @RequestBody PasswordResetInitiateRequest request) {
        try {
            authenticationService.initiateResetToken(request.getEmail());
            return ResponseEntity.ok("Reset token sent if the email exists.");
        } catch (RuntimeException e) {
            logger.warn("Reset request rejected: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to initiate password reset");
        }
    }

    @PostMapping("/reset-password/confirm")
    public ResponseEntity<String> confirmReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        try {
            authenticationService.confirmResetToken(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } catch (RuntimeException e) {
            logger.warn("Reset confirm rejected: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid or expired reset token");
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        try {
            authenticationService.changePassword(request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (org.springframework.security.core.AuthenticationException ae) {
            logger.warn("Password change rejected: bad current password");
            return ResponseEntity.status(401).body("Invalid current password");
        } catch (RuntimeException e) {
            logger.warn("Error while changing password: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to change password");
        } catch (Exception e) {
            logger.error("Error while changing password", e);
            return ResponseEntity.badRequest().body("Failed to change password");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}