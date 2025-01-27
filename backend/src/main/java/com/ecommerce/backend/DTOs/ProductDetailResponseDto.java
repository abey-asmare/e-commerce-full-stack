package com.ecommerce.backend.DTOs;

import com.ecommerce.backend.models.ProductSize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@RequiredArgsConstructor
public class ProductDetailResponseDto {
    private Long id;
    private String title;
    private String description;
    private Integer availableQuantity;
    private String label;
    private String owner;
    private String colorName;
    private String productTypeName;
    private List<ProductSize> sizeName;
    private List<ProductImageResponseDto> images;
    private Set<RelatedProductResponseDto> relatedProducts;
    private Set<CommentResponseDto> comments;
}
