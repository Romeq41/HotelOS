package com.hotelos.hotelosbackend.dto;

import com.hotelos.hotelosbackend.models.ReservationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Reservation Data Transfer Object")

public class ReservationDto {
    private Long reservationId;

    @Size(max = 100, message = "Reservation name must not exceed 100 characters")
    private String reservationName;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    @NotNull(message = "Status is required")
    private ReservationStatus status;

    @Min(value = 1, message = "At least one adult is required")
    private Integer numberOfAdults;

    @PositiveOrZero(message = "Number of children cannot be negative")
    private Integer numberOfChildren;

    private String specialRequests;

    @Nullable
    private UserDto user;

    @NotNull(message = "Room information is required")
    private RoomDto room;
    
    private Set<GuestDto> guests = new HashSet<>();
    
    private String primaryGuestName;
    
    private String primaryGuestEmail;
    
    private String primaryGuestPhone;
}