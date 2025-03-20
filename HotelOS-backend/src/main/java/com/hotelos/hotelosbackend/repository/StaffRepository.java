package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface StaffRepository extends JpaRepository<Staff, Long> {
}
