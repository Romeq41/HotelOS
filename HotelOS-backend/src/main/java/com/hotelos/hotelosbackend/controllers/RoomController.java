package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.mapper.RoomMapper;
import com.hotelos.hotelosbackend.models.EntityImage;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.repository.EntityImageRepository;
import com.hotelos.hotelosbackend.services.CloudinaryServices;
import com.hotelos.hotelosbackend.services.RoomServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "Room Management", description = "APIs for room operations - create, update, delete rooms and manage their images")
public class RoomController {

    @Autowired
    private RoomServices roomServices;

    @Autowired
    private RoomMapper roomMapper;

    @Autowired
    private CloudinaryServices cloudinaryServices;

    @Autowired
    private EntityImageRepository imageRepository;

    @PostMapping
    @Operation(summary = "Add new room", description = "Creates a new room with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Room created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<RoomDto> addRoom(@Valid @RequestBody RoomDto roomDto) {
        Room room = roomMapper.toEntity(roomDto);
        Room savedRoom = roomServices.saveRoom(room);
        return ResponseEntity.ok(roomMapper.toDto(savedRoom));
    }

    @Transactional
    @PostMapping(value = "/{id}/primary-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload primary room image", description = "Sets the main image for a room (will replace existing primary image)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Primary image uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or request"),
            @ApiResponse(responseCode = "404", description = "Room not found"),
            @ApiResponse(responseCode = "500", description = "Server error during upload")
    })
    public ResponseEntity<Map<String, Object>> uploadPrimaryRoomImage(
            @Parameter(description = "Room ID") @PathVariable Long id,
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "File is empty"));
            }

            // Fetch room to verify it exists
            Room room = roomServices.getRoomById(id)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Upload to Cloudinary
            String imageUrl = cloudinaryServices.uploadRoomImage(file, id, room.getHotel().getName(),room.getRoomId(), String.valueOf(room.getRoomNumber()));

            // Unset any existing primary images
            imageRepository.unsetPrimaryForEntity(EntityImage.EntityType.ROOM, id);

            // Determine display order (always 1 for primary image)
            Integer displayOrder = 1;

            // Store image metadata in database
            EntityImage entityImage = new EntityImage();
            entityImage.setEntityType(EntityImage.EntityType.ROOM);
            entityImage.setEntityId(id);
            entityImage.setUrl(imageUrl);
            entityImage.setPublicId(cloudinaryServices.extractPublicIdFromUrl(imageUrl));
            entityImage.setPrimary(true); // Always set as primary
            entityImage.setDisplayOrder(displayOrder);
            entityImage.setUploadDate(LocalDateTime.now());

            EntityImage savedImage = imageRepository.save(entityImage);

            // Return success response with image details
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Primary image uploaded successfully");
            response.put("imageId", savedImage.getId());
            response.put("url", imageUrl);
            response.put("isPrimary", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/{id}/image_upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload additional room image", description = "Uploads an additional non-primary image for a specific room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or request"),
            @ApiResponse(responseCode = "404", description = "Room not found"),
            @ApiResponse(responseCode = "500", description = "Server error during upload")
    })
    public ResponseEntity<Map<String, Object>> uploadRoomImage(
            @Parameter(description = "Room ID") @PathVariable Long id,
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "File is empty"));
            }

            // Fetch room to verify it exists
            Room room = roomServices.getRoomById(id)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Upload to Cloudinary
            String imageUrl = cloudinaryServices.uploadRoomImage(file, id, room.getHotel().getName(),room.getRoomId(), String.valueOf(room.getRoomNumber()));

            // Determine display order (next available number)
            Integer displayOrder = imageRepository.findMaxDisplayOrderForEntity(EntityImage.EntityType.ROOM, id)
                    .orElse(0) + 1;

            // Store image metadata in database
            EntityImage entityImage = new EntityImage();
            entityImage.setEntityType(EntityImage.EntityType.ROOM);
            entityImage.setEntityId(id);
            entityImage.setUrl(imageUrl);
            entityImage.setPublicId(cloudinaryServices.extractPublicIdFromUrl(imageUrl));
            entityImage.setPrimary(false); // Always set as non-primary
            entityImage.setDisplayOrder(displayOrder);
            entityImage.setUploadDate(LocalDateTime.now());

            EntityImage savedImage = imageRepository.save(entityImage);

            // Return success response with image details
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Image uploaded successfully");
            response.put("imageId", savedImage.getId());
            response.put("url", imageUrl);
            response.put("isPrimary", false);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @Transactional
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload multiple room images", description = "Uploads multiple additional non-primary images for a specific room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Images uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid files or request"),
            @ApiResponse(responseCode = "404", description = "Room not found"),
            @ApiResponse(responseCode = "500", description = "Server error during upload")
    })
    public ResponseEntity<?> uploadMultipleRoomImages(
            @Parameter(description = "Room ID") @PathVariable Long id,
            @Parameter(description = "Image files to upload") @RequestParam("files") List<MultipartFile> files)
    {
        try {
            if (files.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "No files provided"));
            }

            Room room = roomServices.getRoomById(id)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Get next display order
            int startingDisplayOrder = imageRepository.findMaxDisplayOrderForEntity(EntityImage.EntityType.ROOM, id)
                    .orElse(0) + 1;

            List<String> urls = cloudinaryServices.uploadMultipleRoomImages(files, id, room.getHotel().getName(),room.getRoomId(), String.valueOf(room.getRoomNumber()));
            List<Map<String, Object>> uploadedImages = new ArrayList<>();

            // Save all images to database as non-primary
            for (int i = 0; i < urls.size(); i++) {
                String url = urls.get(i);

                EntityImage entityImage = new EntityImage();
                entityImage.setEntityType(EntityImage.EntityType.ROOM);
                entityImage.setEntityId(id);
                entityImage.setUrl(url);
                entityImage.setPublicId(cloudinaryServices.extractPublicIdFromUrl(url));
                entityImage.setPrimary(false); // Always non-primary
                entityImage.setDisplayOrder(startingDisplayOrder + i);
                entityImage.setUploadDate(LocalDateTime.now());

                EntityImage savedImage = imageRepository.save(entityImage);

                Map<String, Object> imageDetails = new HashMap<>();
                imageDetails.put("id", savedImage.getId());
                imageDetails.put("url", url);
                imageDetails.put("isPrimary", false);
                uploadedImages.add(imageDetails);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Files uploaded successfully");
            response.put("count", urls.size());
            response.put("images", uploadedImages);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/images")
    @Operation(summary = "Get all room images", description = "Retrieves all images for a specific room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Images retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Room not found")
    })
    public ResponseEntity<?> getAllRoomImages(@Parameter(description = "Room ID") @PathVariable Long id) {
        try {
            Room room = roomServices.getRoomById(id)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            List<EntityImage> images = imageRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                    EntityImage.EntityType.ROOM, id);

            List<Map<String, Object>> result = images.stream().map(img -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", img.getId());
                map.put("url", img.getUrl());
                map.put("isPrimary", img.isPrimary());
                map.put("displayOrder", img.getDisplayOrder());
                map.put("altText", img.getAltText());
                map.put("uploadDate", img.getUploadDate());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/image")
    @Operation(summary = "Get room primary image", description = "Retrieves the primary image URL for a specific room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image URL retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Room or image not found")
    })
    public ResponseEntity<?> getRoomImage(@Parameter(description = "Room ID") @PathVariable Long id) {
        try {
            Optional<EntityImage> primaryImage = imageRepository.findByEntityTypeAndEntityIdAndIsPrimaryTrue(
                    EntityImage.EntityType.ROOM, id);

            if (primaryImage.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("imageUrl", primaryImage.get().getUrl());
                response.put("imageId", primaryImage.get().getId());
                response.put("altText", primaryImage.get().getAltText());
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "No image found for this room"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{roomId}/images/{imageId}")
    @Operation(summary = "Delete room image", description = "Deletes a specific image for a room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Room or image not found")
    })
    public ResponseEntity<?> deleteRoomImage(
            @Parameter(description = "Room ID") @PathVariable Long roomId,
            @Parameter(description = "Image ID") @PathVariable Long imageId) {

        try {
            EntityImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));

            // Verify this image belongs to the specified room
            if (!image.getEntityType().equals(EntityImage.EntityType.ROOM) || !image.getEntityId().equals(roomId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Image does not belong to this room"));
            }

            System.out.println("REMOVING IMAGE: " + image.getUrl());
            System.out.println("IMG PUBLIC ID: " + image.getPublicId());

            // Delete from Cloudinary - use publicId, not URL
            cloudinaryServices.deleteFile(image.getPublicId());

            // Delete from database
            imageRepository.delete(image);

            // If this was the primary image, update to next available
            if (image.isPrimary()) {
                // Find next image to set as primary
                Optional<EntityImage> nextImage = imageRepository.findFirstByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                        EntityImage.EntityType.ROOM, roomId);

                if (nextImage.isPresent()) {
                    nextImage.get().setPrimary(true);
                    imageRepository.save(nextImage.get());
                }
            }

            return ResponseEntity.ok(Collections.singletonMap("message", "Image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @Transactional
    @PutMapping("/{roomId}/images/{imageId}/set-primary")
    @Operation(summary = "Set primary room image", description = "Sets a specific image as the primary image for a room")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Primary image set successfully"),
            @ApiResponse(responseCode = "404", description = "Room or image not found")
    })
    public ResponseEntity<?> setPrimaryRoomImage(
            @Parameter(description = "Room ID") @PathVariable Long roomId,
            @Parameter(description = "Image ID") @PathVariable Long imageId) {

        try {
            EntityImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));

            // Verify this image belongs to the specified room
            if (!image.getEntityType().equals(EntityImage.EntityType.ROOM) || !image.getEntityId().equals(roomId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Image does not belong to this room"));
            }

            // Unset any existing primary images
            imageRepository.unsetPrimaryForEntity(EntityImage.EntityType.ROOM, roomId);

            // Set this image as primary
            image.setPrimary(true);
            imageRepository.save(image);

            return ResponseEntity.ok(Collections.singletonMap("message", "Primary image updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Get all rooms", description = "Returns a paginated list of rooms")
    public ResponseEntity<Page<RoomDto>> getAllRooms(Pageable pageable) {
        return ResponseEntity.ok(roomServices.getAllRooms(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID", description = "Returns details for a specific room")
    public ResponseEntity<RoomDto> getRoomById(
            @Parameter(description = "Room ID") @PathVariable @Positive(message = "ID must be a positive number") Long id) {
        return roomServices.getRoomById(id)
                .map(roomMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update room", description = "Updates a room's information")
    public ResponseEntity<RoomDto> updateRoom(
            @Parameter(description = "Room ID") @PathVariable @Positive(message = "ID must be a positive number") Long id,
            @Valid @RequestBody RoomDto roomDto) {
        return roomServices.getRoomById(id).map(existingRoom -> {
            Room room = roomMapper.toEntity(roomDto);
            room.setRoomId(id);
            System.out.println(room);
            Room updatedRoom = roomServices.saveRoom(room);
            return ResponseEntity.ok(roomMapper.toDto(updatedRoom));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete room", description = "Deletes a room and its associated data")
    public ResponseEntity<Void> deleteRoom(
            @Parameter(description = "Room ID") @PathVariable @Positive(message = "ID must be a positive number") Long id) {
        roomServices.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}