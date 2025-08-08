package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.services.PriceCalculationService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class IPriceCalculationServices implements PriceCalculationService {

    @Override
    public BigDecimal calculateRoomPrice(Room room, LocalDate checkInDate, LocalDate checkOutDate) {
        BigDecimal basePrice = room.getHotel().getBasePrice();

        basePrice = basePrice.multiply(BigDecimal.valueOf(room.getRoomType().getPriceFactor()));

        if (room.getPriceModifier() != null) {
            basePrice = basePrice.multiply(room.getPriceModifier());
        }

        basePrice = applySeasonalFactors(basePrice, room.getHotel().getId(), checkInDate, checkOutDate);

        basePrice = applyOccupancyPricing(basePrice, room.getHotel().getId(), checkInDate, checkOutDate);

        basePrice = applyPromotions(basePrice, room, checkInDate, checkOutDate);

        return basePrice;
    }

    @Override
    public BigDecimal applySeasonalFactors(BigDecimal price, Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        // todo:
        return price;
    }
    @Override

    public BigDecimal applyOccupancyPricing(BigDecimal price, Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        // todo
        return price;
    }
    @Override

    public BigDecimal applyPromotions(BigDecimal price, Room room, LocalDate checkIn, LocalDate checkOut) {
        // todo
        return price;
    }
}
