package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.models.MaintenanceRequest;
import com.hotelos.hotelosbackend.services.MaintenanceRequestServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenanceRequests")
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestServices maintenanceRequestServices;

    @PostMapping
    public ResponseEntity<MaintenanceRequest> addMaintenanceRequest(@RequestBody MaintenanceRequest maintenanceRequest) {
        MaintenanceRequest savedMaintenanceRequest = maintenanceRequestServices.saveMaintenanceRequest(maintenanceRequest);
        return ResponseEntity.ok(savedMaintenanceRequest);
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequest>> getAllMaintenanceRequests() {
        List<MaintenanceRequest> maintenanceRequests = maintenanceRequestServices.getAllMaintenanceRequests();
        return ResponseEntity.ok(maintenanceRequests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getMaintenanceRequestById(@PathVariable Long id) {
        return maintenanceRequestServices.getMaintenanceRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceRequest(@PathVariable Long id) {
        maintenanceRequestServices.deleteMaintenanceRequest(id);
        return ResponseEntity.noContent().build();
    }
}