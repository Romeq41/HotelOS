package com.hotelos.hotelosbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long paymentId;
    private BigDecimal amount;
    private String paymentMethod;
    private Date paymentDate;
    private String status;

    private Long reservationId;
}