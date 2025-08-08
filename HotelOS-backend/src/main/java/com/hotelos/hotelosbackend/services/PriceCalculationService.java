package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Room;


import java.math.BigDecimal;
import java.time.LocalDate;


public interface PriceCalculationService {
    BigDecimal calculateRoomPrice(Room room, LocalDate checkInDate, LocalDate checkOutDate);

    BigDecimal applySeasonalFactors(BigDecimal price, Long hotelId, LocalDate checkIn, LocalDate checkOut);

    BigDecimal applyOccupancyPricing(BigDecimal price, Long hotelId, LocalDate checkIn, LocalDate checkOut);

    BigDecimal applyPromotions(BigDecimal price, Room room, LocalDate checkIn, LocalDate checkOut);
}
