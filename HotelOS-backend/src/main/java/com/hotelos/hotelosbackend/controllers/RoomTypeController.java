package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.RoomTypeDto;
import com.hotelos.hotelosbackend.models.RoomType;
import com.hotelos.hotelosbackend.services.RoomTypeServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@Tag(name = "Room Types", description = "Operations related to room types")
public class RoomTypeController {

    private final RoomTypeServices roomTypeService;

    @Autowired
    public RoomTypeController(RoomTypeServices roomTypeService) {
        this.roomTypeService = roomTypeService;
    }

    @GetMapping
    @Operation(summary = "Get all active room types", description = "Returns all active room types")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved room types",
                    content = @Content(schema = @Schema(implementation = RoomTypeDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<List<RoomTypeDto>> getAllRoomTypes(
            @Parameter(description = "Include inactive room types")
            @RequestParam(required = false, defaultValue = "false") boolean includeInactive) {
        return ResponseEntity.ok(roomTypeService.getAllRoomTypes(includeInactive));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room type by ID", description = "Returns room type by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved room type"),
            @ApiResponse(responseCode = "404", description = "Room type not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<RoomTypeDto> getRoomTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeService.getRoomTypeById(id));
    }

    @GetMapping("/hotel/{hotelId}")
    @Operation(summary = "Get room types by hotel ID", description = "Returns all room types available for a specific hotel")
    public ResponseEntity<List<RoomTypeDto>> getRoomTypesByHotelId(
            @PathVariable Long hotelId,
            @RequestParam(required = false, defaultValue = "false") boolean includeInactive) {
        return ResponseEntity.ok(roomTypeService.getRoomTypesForHotel(hotelId, includeInactive));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new room type", description = "Creates a new room type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Room type created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<RoomTypeDto> createRoomType(@Valid @RequestBody RoomTypeDto roomTypeDto) {
        RoomTypeDto createdRoomType = roomTypeService.createRoomType(roomTypeDto);
        return new ResponseEntity<>(createdRoomType, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update room type", description = "Updates an existing room type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Room type updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Room type not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<RoomTypeDto> updateRoomType(
            @PathVariable Long id,
            @Valid @RequestBody RoomTypeDto roomTypeDto) {
        return ResponseEntity.ok(roomTypeService.updateRoomType(id, roomTypeDto));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate room type", description = "Activates a room type")
    public ResponseEntity<RoomTypeDto> activateRoomType(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeService.setRoomTypeActiveStatus(id, true));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate room type", description = "Deactivates a room type")
    public ResponseEntity<RoomTypeDto> deactivateRoomType(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeService.setRoomTypeActiveStatus(id, false));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete room type", description = "Deletes a room type permanently")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Room type deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Room type not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "409", description = "Room type is in use")
    })
    public ResponseEntity<Void> deleteRoomType(@PathVariable Long id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.noContent().build();
    }
}