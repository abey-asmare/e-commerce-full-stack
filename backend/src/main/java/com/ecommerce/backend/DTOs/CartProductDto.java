package com.ecommerce.backend.DTOs;


import com.ecommerce.backend.models.Cart;
import com.ecommerce.backend.models.Product;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CartProductDto {
    private Cart cart;
    private Product product;
    private Integer quantity;

}
