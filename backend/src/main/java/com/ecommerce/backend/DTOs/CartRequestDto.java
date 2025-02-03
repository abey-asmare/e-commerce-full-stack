package com.ecommerce.backend.DTOs;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CartRequestDto {
    private Long user;

    private Long product; // map manuallyl
    private String color;
    private String productSize;
}
