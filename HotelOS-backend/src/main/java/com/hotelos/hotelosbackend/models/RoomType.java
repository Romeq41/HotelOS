package com.hotelos.hotelosbackend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor

public enum RoomType {
    STANDARD(1.0),
    FAMILY(1.5),
    SUITE(2.0),
    PRESIDENTIAL_SUITE(3.0),
    FAMILY_ROOM(1.8);

    private final double priceFactor;
}
