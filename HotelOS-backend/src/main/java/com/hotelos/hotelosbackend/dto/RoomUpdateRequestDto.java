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
public class RoomUpdateRequestDto {
    private Long roomId;
    private long roomNumber;
    private String type;
    private Integer capacity;
    private BigDecimal rate;
    private RoomStatus status;
    private String description;

    private long hotelId;
}