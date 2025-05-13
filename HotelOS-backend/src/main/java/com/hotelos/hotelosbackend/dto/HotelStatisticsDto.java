package com.hotelos.hotelosbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelStatisticsDto {
    private Long hotelId;
    private Long staffCount;
    private Long managerCount;
    private Long totalUserCount;

    private Long currentlyOccupiedCount;
    private Long currentlyAvailableCount;
    private Long totalRoomCount;

    private Long reservationsCount;
}