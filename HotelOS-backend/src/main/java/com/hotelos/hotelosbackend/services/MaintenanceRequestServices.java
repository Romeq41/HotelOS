package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.MaintenanceRequest;

import java.util.List;
import java.util.Optional;

public interface MaintenanceRequestServices {
    MaintenanceRequest saveMaintenanceRequest(MaintenanceRequest person);

    List<MaintenanceRequest> getAllMaintenanceRequests();

    Optional<MaintenanceRequest> getMaintenanceRequestById(Long id);

    void deleteMaintenanceRequest(Long id);
}
