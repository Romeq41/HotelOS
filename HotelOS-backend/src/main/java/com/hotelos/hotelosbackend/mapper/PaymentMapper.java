package com.hotelos.hotelosbackend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.hotelos.hotelosbackend.dto.PaymentDto;
import com.hotelos.hotelosbackend.models.Payment;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(source = "reservationId", target = "reservationId")
    PaymentDto toDto(Payment payment);
    
    @Mapping(target = "reservationId", source = "reservationId")
    Payment toEntity(PaymentDto paymentDto);
}