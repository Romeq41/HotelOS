package com.hotelos.hotelosbackend.services;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final String baseUploadDir = System.getProperty("user.dir") + "/Uploads";

    private String sanitizeFileName(String fileName) {
        String cleanedName = StringUtils.cleanPath(fileName);
        if (cleanedName.contains("..")) {
            throw new SecurityException("Filename contains invalid path sequence: " + cleanedName);
        }

        cleanedName = cleanedName.replaceAll("[\\\\/:*?\"<>|]", "_");
        return cleanedName;
    }

    public String storeFile(MultipartFile file, String subDir) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        String sanitizedFileName = sanitizeFileName(file.getOriginalFilename());

        Path uploadPath = Paths.get(baseUploadDir, subDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filePath = "uploads/" + subDir + "/" + sanitizedFileName;

        Path finalPath = uploadPath.resolve(sanitizedFileName);

        file.transferTo(finalPath.toFile());

        return filePath;
    }

    public String getFilePath(String subDir, String fileName) {
        return Paths.get(baseUploadDir, subDir, fileName).toString();
    }

    public byte[] getFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (Files.exists(path)) {
            return Files.readAllBytes(path);
        } else {
            throw new IOException("File not found: " + filePath);
        }
    }

    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }

}