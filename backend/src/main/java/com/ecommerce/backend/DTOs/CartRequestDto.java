package com.ecommerce.backend.DTOs;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CartRequestDto {
    private Long user;

//    private Long productId; // map manuallyl
    private String color;
    private String productSize;
}
