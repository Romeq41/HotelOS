package com.hotelos.hotelosbackend.services;

import com.hotelos.hotelosbackend.models.Staff;

import java.util.List;
import java.util.Optional;

public interface StaffServices {
    Staff saveStaff(Staff person);

    List<Staff> getAllStaff();

    Optional<Staff> getStaffById(Long id);

    void deleteStaff(Long id);
}
