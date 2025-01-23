package com.ecommerce.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveImage(MultipartFile file) {
    try {
        // Use an absolute path
        String uploadDir = System.getProperty("user.dir") + "/images";
        File uploadDirectory = new File(uploadDir);

        if (!uploadDirectory.exists() && !uploadDirectory.mkdirs()) {
            throw new RuntimeException("Failed to create directory: " + uploadDir);
        }

        // Generate a unique file name
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File destinationFile = new File(uploadDirectory, fileName);

        // Save the file to the directory
        file.transferTo(destinationFile);

        return destinationFile.getAbsolutePath(); // Return the full path for reference
    } catch (IOException e) {
        throw new RuntimeException("Failed to store image", e);
    }
}

}
