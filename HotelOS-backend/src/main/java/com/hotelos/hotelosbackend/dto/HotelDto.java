package com.hotelos.hotelosbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelDto {
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Address information is required")
    private AddressInformationDto addressInformation;

    @NotNull(message = "Contact information is required")
    private ContactInformationDto contactInformation;

    @NotNull(message = "Base price is required")
    private BigDecimal basePrice;

    private String description;
    
    private String imagePath;
}