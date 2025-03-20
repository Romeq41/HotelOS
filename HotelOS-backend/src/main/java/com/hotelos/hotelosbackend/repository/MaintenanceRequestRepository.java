package com.hotelos.hotelosbackend.repository;

import com.hotelos.hotelosbackend.models.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

}
