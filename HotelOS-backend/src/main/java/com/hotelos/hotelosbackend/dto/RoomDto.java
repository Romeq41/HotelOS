package com.hotelos.hotelosbackend.dto;

import com.hotelos.hotelosbackend.models.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {
    private long roomId;
    private long roomNumber;
    private String type;
    private Integer capacity;
    private BigDecimal rate;
    private RoomStatus status;
    private String description;
    private HotelDto hotel;
}