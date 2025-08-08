package com.hotelos.hotelosbackend.dto;

import com.hotelos.hotelosbackend.models.AddressInformation;
import com.hotelos.hotelosbackend.models.ContactInformation;
import com.hotelos.hotelosbackend.models.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelOfferDto {
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Base price is required")
    private Double basePrice;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @NotBlank(message = "Address information is required")
    private AddressInformation addressInformation;

    @NotBlank(message = "Contact information is required")
    private ContactInformation contactInformation;

    private RoomDto cheapestRoom;

    private Map<RoomType, Long> roomTypeCountAvailableMap;

    private Map<RoomType, RoomDto> cheapestRoomByTypeMap;

    private List<AmenityDto> amenities;
}