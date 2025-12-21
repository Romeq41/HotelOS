package com.hotelos.hotelosbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Room Type Information")
public class RoomTypeDto {

    private Long id;

    @NotBlank(message = "Room type name is required")
    @Schema(description = "Room type name", example = "SUITE")
    private String name;

    @NotNull(message = "Price factor is required")
    @DecimalMin(value = "0.1", message = "Price factor must be greater than 0.1")
    @Schema(description = "Price multiplier for this room type", example = "2.0")
    private double priceFactor;

    @Schema(description = "Room type description", example = "Luxury suite with additional amenities")
    private String description;

    @Schema(description = "ID of the hotel this room type belongs to, null for global types")
    private Long hotelId;

    @Schema(description = "Whether the room type is currently active")
    private boolean active = true;

    @Schema(description = "Creation timestamp", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;
}