package com.hotelos.hotelosbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Room Type Count Data Transfer Object")
public class RoomTypeCountDto {
    private RoomTypeDto roomType;
    private Long count;
}
