package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.models.Staff;
import com.hotelos.hotelosbackend.repository.StaffRepository;
import com.hotelos.hotelosbackend.services.StaffServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IStaffServices implements StaffServices {
    private final StaffRepository staffRepository;

    public IStaffServices(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    public Staff saveStaff(Staff room) {
        return staffRepository.save(room);
    }

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    @Override
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}