package com.hotelos.hotelosbackend.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.text.Normalizer;

@Service
public class CloudinaryServices {
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryServices.class);

    @Autowired
    private Cloudinary cloudinary;

    // Base folder structure constants
    private static final String HOTELS_FOLDER = "hotels";
    private static final String ROOMS_FOLDER = "rooms";
    private static final String USERS_FOLDER = "users";
    private static final String IMAGES_FOLDER = "images";

    /**
     * Upload a single file to Cloudinary with organized folder structure
     */
    public String uploadFile(MultipartFile file, String folder) {
        try {
            // Generate a unique public ID to prevent collisions
            String publicId = folder + "/" + UUID.randomUUID();

            Map<String, Object> params = ObjectUtils.asMap(
                    "public_id", publicId,
                    "overwrite", true,
                    "resource_type", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            logger.info("File uploaded to Cloudinary: {}", publicId);

            // Return the secure URL (HTTPS)
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            logger.error("Failed to upload file to Cloudinary", e);
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }

    /**
     * Upload hotel image with proper folder structure using hotel name
     */
    public String uploadHotelImage(MultipartFile file, Long hotelId, String hotelName) {
        String folderName = createSafeHotelFolderName(hotelId, hotelName);
        String folder = String.format("%s/%s/%s", HOTELS_FOLDER, folderName, IMAGES_FOLDER);
        return uploadFile(file, folder);
    }

    /**
     * Upload multiple hotel images
     */
    public List<String> uploadMultipleHotelImages(List<MultipartFile> files, Long hotelId, String hotelName) {
        String folderName = createSafeHotelFolderName(hotelId, hotelName);
        String folder = String.format("%s/%s/%s", HOTELS_FOLDER, folderName, IMAGES_FOLDER);
        return uploadMultipleFiles(files, folder);
    }

    /**
     * Upload room image with proper folder structure
     */
    public String uploadRoomImage(MultipartFile file, Long hotelId, String hotelName, Long roomId, String roomName) {
        String hotelFolderName = createSafeHotelFolderName(hotelId, hotelName);
        String roomFolderName = createSafeRoomFolderName(roomId, roomName);
        String folder = String.format("%s/%s/%s/%s/%s",
                HOTELS_FOLDER, hotelFolderName, ROOMS_FOLDER, roomFolderName, IMAGES_FOLDER);
        return uploadFile(file, folder);
    }

    /**
     * Upload multiple room images
     */
    public List<String> uploadMultipleRoomImages(List<MultipartFile> files, Long hotelId, String hotelName,
                                                 Long roomId, String roomName) {
        String hotelFolderName = createSafeHotelFolderName(hotelId, hotelName);
        String roomFolderName = createSafeRoomFolderName(roomId, roomName);
        String folder = String.format("%s/%s/%s/%s/%s",
                HOTELS_FOLDER, hotelFolderName, ROOMS_FOLDER, roomFolderName, IMAGES_FOLDER);
        return uploadMultipleFiles(files, folder);
    }

    /**
     * Upload user image with proper folder structure
     */
    public String uploadUserImage(MultipartFile file, Long userId, String username) {
        String userFolderName = createSafeUserFolderName(userId, username);
        String folder = String.format("%s/%s/%s", USERS_FOLDER, userFolderName, IMAGES_FOLDER);
        return uploadFile(file, folder);
    }

    /**
     * Upload multiple files at once
     */
    public List<String> uploadMultipleFiles(List<MultipartFile> files, String folder) {
        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String url = uploadFile(file, folder);
            urls.add(url);
        }

        return urls;
    }

    /**
     * Get all images for a hotel
     */
    public List<Map<String, Object>> getHotelImages(Long hotelId, String hotelName) {
        try {
            String folderName = createSafeHotelFolderName(hotelId, hotelName);
            String prefix = String.format("%s/%s/%s", HOTELS_FOLDER, folderName, IMAGES_FOLDER);
            ApiResponse response = cloudinary.api().resources(
                    ObjectUtils.asMap("type", "upload", "prefix", prefix, "max_results", 100));

            List<Map<String, Object>> resources = (List<Map<String, Object>>) response.get("resources");
            return resources;
        } catch (Exception e) {
            logger.error("Failed to get hotel images", e);
            return new ArrayList<>();
        }
    }

    /**
     * Get all images for a room
     */
    public List<Map<String, Object>> getRoomImages(Long hotelId, String hotelName, Long roomId, String roomName) {
        try {
            String hotelFolderName = createSafeHotelFolderName(hotelId, hotelName);
            String roomFolderName = createSafeRoomFolderName(roomId, roomName);
            String prefix = String.format("%s/%s/%s/%s/%s",
                    HOTELS_FOLDER, hotelFolderName, ROOMS_FOLDER, roomFolderName, IMAGES_FOLDER);

            ApiResponse response = cloudinary.api().resources(
                    ObjectUtils.asMap("type", "upload", "prefix", prefix, "max_results", 100));

            List<Map<String, Object>> resources = (List<Map<String, Object>>) response.get("resources");
            return resources;
        } catch (Exception e) {
            logger.error("Failed to get room images", e);
            return new ArrayList<>();
        }
    }

    /**
     * Delete a file from Cloudinary by URL or public ID
     */
    public boolean deleteFile(String publicIdOrUrl) {
        try {
            String publicId = extractPublicIdFromUrl(publicIdOrUrl);
            Map result = cloudinary.uploader().destroy(publicId, null);
            String status = (String) result.get("result");

            logger.info("Deleting file {}: {}", publicId, status);
            return "ok".equals(status);
        } catch (IOException e) {
            logger.error("Failed to delete file from Cloudinary", e);
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    /**
     * Create a safe folder name for hotels using both ID and name
     */
    private String createSafeHotelFolderName(Long hotelId, String hotelName) {
        if (hotelName == null || hotelName.trim().isEmpty()) {
            return String.valueOf(hotelId);
        }

        // Combine ID and slugified name
        return String.format("%d-%s", hotelId, slugify(hotelName));
    }

    /**
     * Create a safe folder name for rooms using both ID and name
     */
    private String createSafeRoomFolderName(Long roomId, String roomName) {
        if (roomName == null || roomName.trim().isEmpty()) {
            return String.valueOf(roomId);
        }

        // Combine ID and slugified name
        return String.format("%d-%s", roomId, slugify(roomName));
    }

    /**
     * Create a safe folder name for users using both ID and username
     */
    private String createSafeUserFolderName(Long userId, String username) {
        if (username == null || username.trim().isEmpty()) {
            return String.valueOf(userId);
        }

        // Combine ID and slugified username
        return String.format("%d-%s", userId, slugify(username));
    }

    /**
     * Slugify a string for use in URLs and folder names
     * Example: "Grand Hotel & Spa" → "grand-hotel-spa"
     */
    private String slugify(String input) {
        if (input == null) return "";

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();

        // Limit length to avoid extremely long folder names
        return normalized.length() > 50 ? normalized.substring(0, 50) : normalized;
    }

    /**
     * Extract public ID from Cloudinary URL
     * Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/hotels/123-hotel-name/images/abc123
     */
    public String extractPublicIdFromUrl(String url) {
        if (url == null || !url.contains("/upload/")) {
            return url; // Already a public ID or invalid
        }

        // Split the URL by /upload/ and take the part after it
        String[] parts = url.split("/upload/");
        if (parts.length < 2) return url;

        // Get everything after /upload/
        String path = parts[1];

        // Remove version number if present (v1234567890/)
        if (path.startsWith("v") && path.contains("/")) {
            int firstSlash = path.indexOf("/");
            if (firstSlash > 0) {
                // Check if the part before the first slash looks like a version number
                String possibleVersion = path.substring(0, firstSlash);
                if (possibleVersion.matches("v\\d+")) {
                    // Remove the version prefix (e.g., "v1754997990/")
                    path = path.substring(firstSlash + 1);
                }
            }
        }

        // Remove any query parameters
        if (path.contains("?")) {
            path = path.substring(0, path.indexOf("?"));
        }

        // Remove file extension if present
        if (path.contains(".")) {
            path = path.substring(0, path.lastIndexOf("."));
        }

        return path;
    }
}