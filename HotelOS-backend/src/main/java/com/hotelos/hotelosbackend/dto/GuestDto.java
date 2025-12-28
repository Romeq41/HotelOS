package com.hotelos.hotelosbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Guest Data Transfer Object")

public class GuestDto {
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    private String email;

    private String phoneNumber;

    private String idDocumentType;

    private String idDocumentNumber;

    private LocalDate dateOfBirth;

    private String nationality;

    private Long bookedById; // Reference to User ID who made the booking

    private Boolean isPrimaryGuest;

    private Boolean isAdult;

    private String specialRequirements;
}