package com.hotelos.hotelosbackend.dto;

import com.hotelos.hotelosbackend.models.AmenityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmenityDto {
    private Long id;

    @NotNull(message = "Hotel ID is required")
    private HotelDto hotel;

    @NotBlank(message = "Amenity name is required")
    private String name;

    private String description;

    private AmenityType type;

    private Double distanceKm;

    private String imageUrl;
}