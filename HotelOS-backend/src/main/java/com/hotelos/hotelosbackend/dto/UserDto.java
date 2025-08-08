package com.hotelos.hotelosbackend.dto;

import com.hotelos.hotelosbackend.models.UserType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long userId;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    // Only for registration/updates
    private String password;

    @NotNull(message = "Address information is required")
    private AddressInformationDto addressInformation;

    @NotNull(message = "Contact information is required")
    private ContactInformationDto contactInformation;

    @NotNull(message = "User type is required")
    private UserType userType;

    private String position;
    
    private String imagePath;

    private HotelDto hotel;
}