package com.ecommerce.backend.DTOs;

import lombok.*;
import org.modelmapper.ModelMapper;

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
    private Integer discountedPercentage;
    private List<ProductImageResponseDto> images;

}
