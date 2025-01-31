package com.ecommerce.backend.services;

import com.ecommerce.backend.DTOs.CartRequestDto;
import com.ecommerce.backend.models.Cart;
import com.ecommerce.backend.repositories.CartRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;

@Service
public class CartService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserService userService;

    @Autowired
    ColorService colorService;

    @Autowired
    ProductSizeService productSizeService;

    @Transactional
    public boolean addToCart(CartRequestDto dto){
        System.out.println(dto);
        Cart cart = new Cart();
        cart.setUser(userService.findById(dto.getUser()));
        cart.setColor(colorService.findByName(dto.getColor()));
        cart.setProductSize(productSizeService.findBySize(dto.getProductSize()));
        cart.setCartProducts(new HashSet<>());
        System.out.println(cart);
        return true;
    }

}
