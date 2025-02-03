package com.ecommerce.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Saves an image to the configured upload directory.
     *
     * @param file The uploaded image file.
     * @return The relative path of the saved file (e.g., "/images/<fileName>").
     */
    public String saveImage(MultipartFile file) {
        // Validate the image format
        String contentType = file.getContentType();
        if (!List.of("image/jpeg", "image/png").contains(contentType)) {
            throw new RuntimeException("Invalid image format: " + contentType);
        }

        try {
            // Resolve the full path for the upload directory
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            File uploadDirectory = uploadPath.toFile();

            // Ensure the directory exists
            if (!uploadDirectory.exists() && !uploadDirectory.mkdirs()) {
                throw new RuntimeException("Failed to create directory: " + uploadPath);
            }

            // Sanitize and normalize the file name
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new RuntimeException("Invalid file name");
            }

            String sanitizedFileName = sanitizeFileName(originalFileName);
            String fileName = UUID.randomUUID() + "_" + sanitizedFileName;

            // Save the file to the specified directory
            File destinationFile = new File(uploadDirectory, fileName);
            file.transferTo(destinationFile);

            // Return the relative path to the file for frontend access
            return "/images/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    /**
     * Sanitizes a file name by replacing spaces and removing problematic characters.
     *
     * @param fileName The original file name.
     * @return A sanitized file name.
     */
    private String sanitizeFileName(String fileName) {
        // Replace spaces with underscores and remove non-ASCII characters
        String sanitized = fileName.replaceAll("\\s+", "_");
        sanitized = Normalizer.normalize(sanitized, Normalizer.Form.NFD)
                .replaceAll("[^\\w.-]", ""); // Keep letters, numbers, dashes, and dots
        return sanitized;
    }

    public void deleteImage(String imageUrl) {
    if (imageUrl == null || imageUrl.isEmpty()) return;

    // Extract file name from URL
    String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    Path filePath = Paths.get(uploadDir).resolve(fileName);

    try {
        Files.deleteIfExists(filePath);
    } catch (IOException e) {
        System.out.println("Error deleting file: " + fileName);
    }
}


}
