package com.hotelos.hotelosbackend.dto;

import com.hotelos.hotelosbackend.models.RoomStatus;
import com.hotelos.hotelosbackend.models.RoomType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Room Data Transfer Object")
public class RoomDto {

    @NotNull(message = "Room ID is required")
    private long roomId;

    @NotNull(message = "Room number is required")
    @Positive(message = "Room number must be a positive number")
    private long roomNumber;

    @NotNull(message = "Room type is required")
    @Schema(description = "Type of room with its pricing factor")
    private RoomTypeDto roomType;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be a positive number")
    private Integer capacity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal priceModifier;

    @NotNull(message = "Status is required")
    private RoomStatus status;

    @Length(max = 300, message = "Description cannot exceed 300 characters")
    private String description;

    private String imagePath;

    @NotNull(message = "Hotel information is required")
    private HotelDto hotel;
}

