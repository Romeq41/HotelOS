package com.hotelos.hotelosbackend.mail;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String defaultFrom;

    /**
     * Sends a basic plain-text email; errors are logged but not propagated.
     */
    public void sendPlainText(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (defaultFrom != null && !defaultFrom.isBlank()) {
                message.setFrom(defaultFrom);
            }
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            logger.error("Failed to send email to {}", to, ex);
        }
    }

    public void sendWelcomeEmail(String to, String firstName) {
        String safeName = (firstName == null || firstName.isBlank()) ? "there" : firstName;
        sendPlainText(
                to,
                "Welcome to HotelOS",
                "Hi " + safeName + ",\n\n" +
                        "Welcome to HotelOS! Your account has been created successfully.\n\n" +
                        "You can now log in and start managing your stays.\n\n" +
                        "If you did not request this account, please contact support.");
    }

    public void sendTemporaryPassword(String to, String tempPassword) {
        sendPlainText(
                to,
                "Your temporary HotelOS password",
                "We generated a temporary password for your account:\n\n" +
                        tempPassword + "\n\n" +
                        "Please log in and change your password immediately.");
    }

    public void sendPasswordResetToken(String to, String token) {
        sendPlainText(
                to,
                "Reset your HotelOS password",
                "Use the following reset token to set a new password:\n\n" +
                        token + "\n\n" +
                        "This token expires soon. If you did not request a reset, you can ignore this email.");
    }

    public void sendPasswordChanged(String to, String firstName) {
        String safeName = (firstName == null || firstName.isBlank()) ? "there" : firstName;
        sendPlainText(
                to,
                "Your HotelOS password was changed",
                "Hi " + safeName + ",\n\n" +
                        "This is a confirmation that your HotelOS account password was changed.\n\n" +
                        "If you made this change, no action is needed.\n" +
                        "If you did not authorize this change, please reset your password immediately or contact support.");
    }
}
