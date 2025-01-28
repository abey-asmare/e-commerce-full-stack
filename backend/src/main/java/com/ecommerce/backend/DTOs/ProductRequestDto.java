package com.ecommerce.backend.DTOs;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductRequestDto {
    @NotBlank(message = "Product title is required")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Available quantity is required")
    private Integer availableQuantity;

    @NotBlank(message = "Color name is required")
    private String colorName;

    @NotNull(message = "price is required")
    @Min(0)
    private Double price;

    @NotBlank(message = "Product type is required")
    private String productTypeName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotEmpty(message= "product size is required")
    private List<String> sizeNames;

    @Size(max = 4, message = "You can upload up to 4 images")
    private List<MultipartFile> images;

    @Size(max = 5, message = "You can add up to 5 related products")
    private List<Long> relatedProductIds;
}
