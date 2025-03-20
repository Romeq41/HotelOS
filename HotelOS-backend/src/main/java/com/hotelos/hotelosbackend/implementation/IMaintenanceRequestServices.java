package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.MaintenanceRequest;
import com.hotelos.hotelosbackend.repository.MaintenanceRequestRepository;
import com.hotelos.hotelosbackend.services.MaintenanceRequestServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IMaintenanceRequestServices implements MaintenanceRequestServices {
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public IMaintenanceRequestServices(MaintenanceRequestRepository maintenanceRequestRepository) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
    }

    @Override
    public MaintenanceRequest saveMaintenanceRequest(MaintenanceRequest maintenanceRequest) {
        return maintenanceRequestRepository.save(maintenanceRequest);
    }

    @Override
    public List<MaintenanceRequest> getAllMaintenanceRequests() {
        return maintenanceRequestRepository.findAll();
    }

    @Override
    public Optional<MaintenanceRequest> getMaintenanceRequestById(Long id) {
        return maintenanceRequestRepository.findById(id);
    }

    @Override
    public void deleteMaintenanceRequest(Long id) {
        maintenanceRequestRepository.deleteById(id);
    }
}