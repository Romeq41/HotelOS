package com.hotelos.hotelosbackend.controllers;

import com.hotelos.hotelosbackend.dto.*;
import com.hotelos.hotelosbackend.mapper.*;
import com.hotelos.hotelosbackend.models.EntityImage;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.repository.EntityImageRepository;
import com.hotelos.hotelosbackend.services.CloudinaryServices;
import com.hotelos.hotelosbackend.services.HotelServices;
import com.hotelos.hotelosbackend.services.RoomServices;
import com.hotelos.hotelosbackend.services.UserServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
@Tag(name = "Hotel Management", description = "APIs for hotel operations - create, update, delete hotels and manage their properties")
public class HotelController {

    @Autowired
    private HotelServices hotelServices;

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoomServices roomServices;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private RoomMapper roomMapper;

    @Autowired
    private AddressInformationMapper addressInformationMapper;

    @Autowired
    private ContactInformationMapper contactInformationMapper;

    @Autowired
    private CloudinaryServices cloudinaryServices;

    @Autowired
    private EntityImageRepository imageRepository;

    @PostMapping
    @Operation(summary = "Add new hotel", description = "Creates a new hotel with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hotel created successfully",
                    content = @Content(schema = @Schema(implementation = HotelDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content)
    })
    public ResponseEntity<HotelDto> addHotel(@Valid @RequestBody HotelDto hotelDto) {
        Hotel savedHotel = hotelServices.saveHotel(hotelMapper.toEntity(hotelDto));
        return ResponseEntity.ok(hotelMapper.toDto(savedHotel));
    }


    @GetMapping("/{id}/image")
    @Operation(summary = "Get hotel primary image", description = "Retrieves the primary image URL for a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image URL retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel or image not found")
    })
    public ResponseEntity<?> getHotelImage(@Parameter(description = "Hotel ID") @PathVariable Long id) {

        System.out.println("GETTING HOTEL IMAGE");
        try {
            Optional<EntityImage> primaryImage = imageRepository.findByEntityTypeAndEntityIdAndIsPrimaryTrue(
                    EntityImage.EntityType.HOTEL, id);

            if (primaryImage.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("imageUrl", primaryImage.get().getUrl());
                response.put("imageId", primaryImage.get().getId());
                response.put("altText", primaryImage.get().getAltText());
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "No image found for this hotel"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/images")
    @Operation(summary = "Get all hotel images", description = "Retrieves all images for a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Images retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<?> getAllHotelImages(@Parameter(description = "Hotel ID") @PathVariable Long id) {
        try {
            Hotel hotel = hotelServices.getHotelById(id)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            List<EntityImage> images = imageRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                    EntityImage.EntityType.HOTEL, id);

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

    @Transactional
    @PostMapping(value = "/{id}/primary-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload primary hotel image", description = "Sets the main image for a hotel (will replace existing primary image)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Primary image uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or request"),
            @ApiResponse(responseCode = "404", description = "Hotel not found"),
            @ApiResponse(responseCode = "500", description = "Server error during upload")
    })
    public ResponseEntity<Map<String, Object>> uploadPrimaryHotelImage(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "File is empty"));
            }

            // Fetch hotel to verify it exists and get name for folder structure
            Hotel hotel = hotelServices.getHotelById(id)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            // Upload to Cloudinary
            String imageUrl = cloudinaryServices.uploadHotelImage(file, id, hotel.getName());

            // Unset any existing primary images
            imageRepository.unsetPrimaryForEntity(EntityImage.EntityType.HOTEL, id);

            // Determine display order (always 1 for primary image)
            Integer displayOrder = 1;

            // Store image metadata in database
            EntityImage entityImage = new EntityImage();
            entityImage.setEntityType(EntityImage.EntityType.HOTEL);
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
    @Operation(summary = "Upload additional hotel image", description = "Uploads an additional non-primary image for a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or request"),
            @ApiResponse(responseCode = "404", description = "Hotel not found"),
            @ApiResponse(responseCode = "500", description = "Server error during upload")
    })
    public ResponseEntity<Map<String, Object>> uploadHotelImage(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "File is empty"));
            }

            // Fetch hotel to verify it exists and get name for folder structure
            Hotel hotel = hotelServices.getHotelById(id)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            // Upload to Cloudinary
            String imageUrl = cloudinaryServices.uploadHotelImage(file, id, hotel.getName());

            // Determine display order (next available number)
            Integer displayOrder = imageRepository.findMaxDisplayOrderForEntity(EntityImage.EntityType.HOTEL, id)
                    .orElse(0) + 1;

            // Store image metadata in database
            EntityImage entityImage = new EntityImage();
            entityImage.setEntityType(EntityImage.EntityType.HOTEL);
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
    @Operation(summary = "Upload multiple hotel images", description = "Uploads multiple additional non-primary images for a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Images uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid files or request"),
            @ApiResponse(responseCode = "404", description = "Hotel not found"),
            @ApiResponse(responseCode = "500", description = "Server error during upload")
    })
    public ResponseEntity<?> uploadMultipleHotelImages(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "Image files to upload") @RequestParam("files") List<MultipartFile> files)
    {
        try {
            if (files.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "No files provided"));
            }

            Hotel hotel = hotelServices.getHotelById(id)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            // Get next display order
            int startingDisplayOrder = imageRepository.findMaxDisplayOrderForEntity(EntityImage.EntityType.HOTEL, id)
                    .orElse(0) + 1;

            List<String> urls = cloudinaryServices.uploadMultipleHotelImages(files, id, hotel.getName());
            List<Map<String, Object>> uploadedImages = new ArrayList<>();

            // Save all images to database as non-primary
            for (int i = 0; i < urls.size(); i++) {
                String url = urls.get(i);

                EntityImage entityImage = new EntityImage();
                entityImage.setEntityType(EntityImage.EntityType.HOTEL);
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

    @DeleteMapping("/{hotelId}/images/{imageId}")
    @Operation(summary = "Delete hotel image", description = "Deletes a specific image for a hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel or image not found")
    })
    public ResponseEntity<?> deleteHotelImage(
            @Parameter(description = "Hotel ID") @PathVariable Long hotelId,
            @Parameter(description = "Image ID") @PathVariable Long imageId) {

        try {
            EntityImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));

            // Verify this image belongs to the specified hotel
            if (!image.getEntityType().equals(EntityImage.EntityType.HOTEL) || !image.getEntityId().equals(hotelId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Image does not belong to this hotel"));
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
                        EntityImage.EntityType.HOTEL, hotelId);

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

    @PutMapping("/{hotelId}/images/{imageId}/set-primary")
    @Operation(summary = "Set primary hotel image", description = "Sets a specific image as the primary image for a hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Primary image set successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel or image not found")
    })
    public ResponseEntity<?> setPrimaryHotelImage(
            @Parameter(description = "Hotel ID") @PathVariable Long hotelId,
            @Parameter(description = "Image ID") @PathVariable Long imageId) {

        try {
            EntityImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));

            // Verify this image belongs to the specified hotel
            if (!image.getEntityType().equals(EntityImage.EntityType.HOTEL) || !image.getEntityId().equals(hotelId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Image does not belong to this hotel"));
            }

            // Unset any existing primary images
            imageRepository.unsetPrimaryForEntity(EntityImage.EntityType.HOTEL, hotelId);

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
    @Operation(summary = "Get all hotels", description = "Returns a paginated list of hotels with optional filtering")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hotels retrieved successfully")
    })
    public ResponseEntity<Page<HotelDto>> getAllHotels(
            @Parameter(description = "Page number (zero-based)") @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") @PositiveOrZero int size,
            @Parameter(description = "Filter by hotel name") @RequestParam(required = false) String hotel_name,
            @Parameter(description = "Filter by country") @RequestParam(required = false) String country,
            @Parameter(description = "Filter by city") @RequestParam(required = false) String city
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelDto> hotels = hotelServices.getHotelsWithFiltersPaginated(hotel_name, country, city, pageable).map(hotelMapper::toDto);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/offers")
    @Operation(summary = "Get hotel offers", description = "Returns a paginated list of hotel offers with optional filtering")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hotel offers retrieved successfully")
    })
    public ResponseEntity<Page<HotelOfferDto>> getHotelsWithOffers(
            @Parameter(description = "Page number (zero-based)") @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") @PositiveOrZero int size,
            @Parameter(description = "Filter by hotel name") @RequestParam(required = false) String hotel_name,
            @Parameter(description = "Filter by country") @RequestParam(required = false) String country,
            @Parameter(description = "Filter by city") @RequestParam(required = false) String city,
            @Parameter(description = "Sort results by this field") @RequestParam(required = false) String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelOfferDto> hotelsWithOffers = hotelServices.getHotelsOffersWithFilters(hotel_name, country, city, sortBy, pageable);
        return ResponseEntity.ok(hotelsWithOffers);
    }

    @GetMapping("{id}/offer")
    @Operation(summary = "Get specific hotel offer", description = "Returns offer details for a specific hotel with optional date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hotel offer retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<HotelOfferDto> getHotelWithOffers(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "Check-in date") @RequestParam(required = false) LocalDate checkIn,
            @Parameter(description = "Check-out date") @RequestParam(required = false) LocalDate checkOut
    ) {
        return hotelServices.getHotelById(id).map(hotel -> {
            HotelOfferDto hotelOffer = hotelServices.getHotelOfferById(hotel.getId(), checkIn, checkOut);
            return ResponseEntity.ok(hotelOffer);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hotel by ID", description = "Returns details for a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hotel found"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<HotelDto> getHotelById(
            @Parameter(description = "Hotel ID") @PathVariable Long id) {
        return hotelServices.getHotelById(id).map(hotelMapper::toDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/statistics")
    @Operation(summary = "Get hotel statistics", description = "Returns statistical data for a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<HotelStatisticsDto> getHotelStatistics(
            @Parameter(description = "Hotel ID") @PathVariable Long id) {
        return hotelServices.getHotelById(id).map(hotel -> {
            HotelStatisticsDto statistics = hotelServices.getHotelStatistics(hotel);
            return ResponseEntity.ok(statistics);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/users")
    @Operation(summary = "Get users by hotel ID", description = "Returns users associated with a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<Page<UserDto>> getUsersByHotelId(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Filter by email") @RequestParam(required = false) String email) {
        Pageable pageable = PageRequest.of(page, size);
        return hotelServices.getHotelById(id).map(hotel -> {
            Page<UserDto> users = userServices.getUsersWithFilters(email, id, pageable).map(userMapper::toDto);
            return ResponseEntity.ok(users);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/rooms")
    @Operation(summary = "Get rooms by hotel ID", description = "Returns rooms associated with a specific hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rooms retrieved successfully")
    })
    public ResponseEntity<Page<RoomDto>> getRoomsByHotelId(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Filter by room number") @RequestParam(required = false) Long roomNumber) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoomDto> rooms = roomServices.getRoomsWithFilters(id, roomNumber, pageable).map(roomMapper::toDto);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}/rooms/cheapest")
    @Operation(summary = "Get cheapest room by hotel ID", description = "Returns the lowest priced room for a hotel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cheapest room found"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<RoomDto> getCheapestRoomByHotelId(
            @Parameter(description = "Hotel ID") @PathVariable Long id) {
        return hotelServices.getHotelById(id).map(hotel -> {
            RoomDto cheapestRoom = roomServices.getCheapestRoomByHotelId(id);
            return ResponseEntity.ok(cheapestRoom);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update hotel", description = "Updates a hotel's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Hotel updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<HotelDto> updateHotelById(
            @Parameter(description = "Hotel ID") @PathVariable Long id,
            @Valid @RequestBody HotelDto hotelDto) {
        return hotelServices.getHotelById(id).map(hotel -> {
            hotel.setName(hotelDto.getName());
            hotel.setDescription(hotelDto.getDescription());
            hotel.setBasePrice(hotelDto.getBasePrice());
            hotel.setAddressInformation(addressInformationMapper.toEntity(hotelDto.getAddressInformation()));
            hotel.setContactInformation(contactInformationMapper.toEntity(hotelDto.getContactInformation()));
            Hotel updatedHotel = hotelServices.saveHotel(hotel);
            return ResponseEntity.ok(hotelMapper.toDto(updatedHotel));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete hotel", description = "Deletes a hotel and updates related entities")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Hotel deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<Void> deleteHotel(
            @Parameter(description = "Hotel ID") @PathVariable Long id) {
        hotelServices.getHotelById(id).ifPresent(hotel -> {
            userServices.getUsersByHotel(hotel).forEach(user -> {
                user.setHotel(null);
                userServices.updateUser(user);
            });
            roomServices.getRoomsByHotel(id).forEach(room -> roomServices.deleteRoom(room.getRoomId()));
            hotelServices.deleteHotel(id);
        });
        return ResponseEntity.noContent().build();
    }
}