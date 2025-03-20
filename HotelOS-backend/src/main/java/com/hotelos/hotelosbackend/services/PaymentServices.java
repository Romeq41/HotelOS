package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentServices {
    Payment savePayment(Payment person);

    List<Payment> getAllPayments();

    Optional<Payment> getPaymentById(Long id);

    void deletePayment(Long id);
}
