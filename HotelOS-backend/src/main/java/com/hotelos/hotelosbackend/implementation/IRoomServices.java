package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.dto.RoomDto;
import com.hotelos.hotelosbackend.mapper.RoomMapper;
import com.hotelos.hotelosbackend.models.EntityImage;
import com.hotelos.hotelosbackend.models.Hotel;
import com.hotelos.hotelosbackend.models.Room;
import com.hotelos.hotelosbackend.repository.EntityImageRepository;
import com.hotelos.hotelosbackend.repository.RoomRepository;
import com.hotelos.hotelosbackend.services.CloudinaryServices;
import com.hotelos.hotelosbackend.services.PriceCalculationService;
import com.hotelos.hotelosbackend.services.RoomServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IRoomServices implements RoomServices {
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    @Autowired
    private CloudinaryServices cloudinaryServices;

    @Autowired
    private EntityImageRepository imageRepository;

    @Autowired
    private PriceCalculationService priceCalculationService;

    public IRoomServices(RoomRepository roomRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.roomMapper = roomMapper;
    }

    @Override
    public Room saveRoom(Room room) {
        if (room.getRoomId() > 0) {
            List<Room> existingRooms = roomRepository.findByRoomNumberAndHotel_Id(room.getRoomNumber(),
                    room.getHotel().getId());

            boolean hasDuplicate = existingRooms.stream()
                    .anyMatch(existingRoom -> existingRoom.getRoomId() != room.getRoomId());

            if (hasDuplicate) {
                throw new IllegalArgumentException("Room number must be unique within the same hotel.");
            }
        } else {
            boolean exists = roomRepository.existsByRoomNumberAndHotel_Id(room.getRoomNumber(),
                    room.getHotel().getId());
            if (exists) {
                throw new IllegalArgumentException("Room number must be unique within the same hotel.");
            }
        }
        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public String storeImage(MultipartFile file, Long roomId) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file");
        }

        Room room = getRoomById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Hotel hotel = room.getHotel();

        // Upload to Cloudinary using the hotel ID and name for proper folder structure
        String imageUrl = cloudinaryServices.uploadRoomImage(
                file, hotel.getId(), hotel.getName(), roomId, "Room-" + room.getRoomNumber());

        // Determine if this should be the primary image
        boolean isPrimary = !imageRepository.existsByEntityTypeAndEntityId(EntityImage.EntityType.ROOM, roomId);

        // Determine display order
        Integer displayOrder = imageRepository.findMaxDisplayOrderForEntity(EntityImage.EntityType.ROOM, roomId)
                .orElse(0) + 1;

        // Store image metadata in database
        EntityImage entityImage = new EntityImage();
        entityImage.setEntityType(EntityImage.EntityType.ROOM);
        entityImage.setEntityId(roomId);
        entityImage.setUrl(imageUrl);
        entityImage.setPublicId(cloudinaryServices.extractPublicIdFromUrl(imageUrl));
        entityImage.setPrimary(isPrimary);
        entityImage.setDisplayOrder(displayOrder);
        entityImage.setUploadDate(LocalDateTime.now());

        imageRepository.save(entityImage);

        // Update room's primary image path for backward compatibility
        if (isPrimary) {
            room.setImagePath(imageUrl);
            roomRepository.save(room);
        }

        return imageUrl;
    }

    @Override
    @Transactional
    public List<String> storeMultipleImages(List<MultipartFile> files, Long roomId) throws IOException {
        if (files.isEmpty()) {
            throw new IOException("No files provided");
        }

        Room room = getRoomById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Hotel hotel = room.getHotel();

        // Upload all files to Cloudinary
        List<String> imageUrls = cloudinaryServices.uploadMultipleRoomImages(
                files, hotel.getId(), hotel.getName(), roomId, "Room-" + room.getRoomNumber());

        // Determine if these are the first images
        boolean noExistingImages = !imageRepository.existsByEntityTypeAndEntityId(EntityImage.EntityType.ROOM, roomId);

        // Get next display order
        Integer startingDisplayOrder = imageRepository.findMaxDisplayOrderForEntity(EntityImage.EntityType.ROOM, roomId)
                .orElse(0) + 1;

        // Save all images to database
        for (int i = 0; i < imageUrls.size(); i++) {
            String url = imageUrls.get(i);
            boolean isPrimary = noExistingImages && i == 0; // First image is primary if no existing images

            EntityImage entityImage = new EntityImage();
            entityImage.setEntityType(EntityImage.EntityType.ROOM);
            entityImage.setEntityId(roomId);
            entityImage.setUrl(url);
            entityImage.setPublicId(cloudinaryServices.extractPublicIdFromUrl(url));
            entityImage.setPrimary(isPrimary);
            entityImage.setDisplayOrder(startingDisplayOrder + i);
            entityImage.setUploadDate(LocalDateTime.now());

            imageRepository.save(entityImage);

            // Update room's primary image path for the first image
            if (isPrimary) {
                room.setImagePath(url);
                roomRepository.save(room);
            }
        }

        return imageUrls;
    }

    @Override
    public List<Map<String, Object>> getRoomImages(Long roomId) {
        Room room = getRoomById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<EntityImage> images = imageRepository.findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                EntityImage.EntityType.ROOM, roomId);

        // Handle legacy support for the single imagePath
        if (images.isEmpty() && room.getImagePath() != null && !room.getImagePath().isEmpty()) {
            Map<String, Object> legacyImage = new HashMap<>();
            legacyImage.put("url", room.getImagePath());
            legacyImage.put("isPrimary", true);
            legacyImage.put("displayOrder", 0);
            return Collections.singletonList(legacyImage);
        }

        return images.stream().map(img -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", img.getId());
            map.put("url", img.getUrl());
            map.put("isPrimary", img.isPrimary());
            map.put("displayOrder", img.getDisplayOrder());
            map.put("uploadDate", img.getUploadDate());
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public String getPrimaryRoomImage(Long roomId) {
        // First try to find primary image in new system
        Optional<EntityImage> primaryImage = imageRepository.findByEntityTypeAndEntityIdAndIsPrimaryTrue(
                EntityImage.EntityType.ROOM, roomId);

        if (primaryImage.isPresent()) {
            return primaryImage.get().getUrl();
        }

        // Fallback to legacy imagePath
        Room room = getRoomById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return room.getImagePath();
    }

    @Override
    @Transactional
    public void deleteRoomImage(Long roomId, Long imageId) {
        EntityImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Verify this image belongs to the specified room
        if (!image.getEntityType().equals(EntityImage.EntityType.ROOM) || !image.getEntityId().equals(roomId)) {
            throw new RuntimeException("Image does not belong to this room");
        }

        // Delete from Cloudinary
        cloudinaryServices.deleteFile(image.getPublicId());

        // If this was the primary image, update room and set next image as primary
        boolean wasPrimary = image.isPrimary();

        // Delete from database
        imageRepository.delete(image);

        // If primary was deleted, set a new primary
        if (wasPrimary) {
            Room room = getRoomById(roomId)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Find next image to set as primary
            Optional<EntityImage> nextImage = imageRepository.findFirstByEntityTypeAndEntityIdOrderByDisplayOrderAsc(
                    EntityImage.EntityType.ROOM, roomId);

            if (nextImage.isPresent()) {
                nextImage.get().setPrimary(true);
                imageRepository.save(nextImage.get());
                room.setImagePath(nextImage.get().getUrl());
            } else {
                room.setImagePath(null);
            }

            roomRepository.save(room);
        }
    }

    @Override
    @Transactional
    public void setPrimaryRoomImage(Long roomId, Long imageId) {
        EntityImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Verify this image belongs to the specified room
        if (!image.getEntityType().equals(EntityImage.EntityType.ROOM) || !image.getEntityId().equals(roomId)) {
            throw new RuntimeException("Image does not belong to this room");
        }

        // Unset any existing primary images
        imageRepository.unsetPrimaryForEntity(EntityImage.EntityType.ROOM, roomId);

        // Set this image as primary
        image.setPrimary(true);
        imageRepository.save(image);

        // Update room's main image path for backward compatibility
        Room room = getRoomById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setImagePath(image.getUrl());
        roomRepository.save(room);
    }

    @Override
    public Page<RoomDto> getAllRooms(Pageable pageable) {
        return roomRepository.findAll(pageable)
                .map(roomMapper::toDto);
    }

    @Override
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    @Override
    public List<Room> getRoomsByHotel(Long id) {
        return roomRepository.findAllByHotelId(id);
    }

    @Override
    public Page<Room> getRoomsWithFilters(long hotel_id, Long roomNumber, Pageable pageable) {
        Optional<Long> roomOpt = Optional.ofNullable(roomNumber).filter(e -> e > 0);

        if (roomOpt.isPresent()) {
            return roomRepository.findByRoomNumberAndHotelId(roomNumber, hotel_id, pageable);
        } else {
            return roomRepository.findByHotelId(hotel_id, pageable);
        }
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    @Override
    public RoomDto getCheapestRoomByHotelId(Long id) {
        List<Room> rooms = roomRepository.findAllByHotelId(id);
        List<RoomDto> roomDtos = rooms.stream()
                .map(room -> roomMapper.toDto(room, null, null))
                .toList();

        return roomDtos.stream()
                .min(Comparator.comparing(RoomDto::getPrice))
                .orElse(null);
    }
}