package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
