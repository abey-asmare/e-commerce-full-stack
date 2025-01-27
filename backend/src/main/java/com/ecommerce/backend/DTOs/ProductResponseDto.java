package com.ecommerce.backend.DTOs;

import com.ecommerce.backend.models.Color;
import lombok.*;
import org.modelmapper.ModelMapper;

import java.util.HashSet;
import java.util.List;

@Data
@RequiredArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String title;
    private String description;
    private Integer availableQuantity;
    private String label;
    private Double price;
    private List<ProductSizeResponseDto> sizes;
    private Integer discountedPercentage;
    private List<ProductImageResponseDto> images;

}
