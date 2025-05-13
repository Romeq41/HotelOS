package com.hotelos.hotelosbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String zipCode;
    private String country;
}