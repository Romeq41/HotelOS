package com.hotelos.hotelosbackend.models;

public enum UserType {
    GUEST,     // Regular hotel guest
    STAFF,     // Regular hotel staff
    MANAGER,   // Hotel manager with additional privileges
    ADMIN      // System administrator with full access
}