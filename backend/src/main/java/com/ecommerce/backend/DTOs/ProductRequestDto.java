package com.ecommerce.backend.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductRequestDto {
    @NotBlank(message = "Product title is required")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotBlank(message = "Available quantity is required")
    private String availableQuantity;

    @NotBlank(message = "Color name is required")
    private String colorName;

    @NotBlank(message = "Product type is required")
    private String productTypeName;

    private String sizeName;

    @Size(max = 4, message = "You can upload up to 4 images")
    private List<MultipartFile> images;

    @Size(max = 5, message = "You can add up to 5 related products")
    private List<Long> relatedProductIds;
}
