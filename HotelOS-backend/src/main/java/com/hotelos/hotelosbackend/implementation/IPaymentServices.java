package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Payment;
import com.hotelos.hotelosbackend.repository.PaymentRepository;
import com.hotelos.hotelosbackend.services.PaymentServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IPaymentServices implements PaymentServices {
    private final PaymentRepository paymentRepository;

    public IPaymentServices(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}