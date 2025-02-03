//package com.ecommerce.backend.services;
//
//import com.ecommerce.backend.DTOs.CartRequestDto;
//import com.ecommerce.backend.models.*;
//import com.ecommerce.backend.repositories.CartProductRepository;
//import com.ecommerce.backend.repositories.CartRepository;
//import jakarta.transaction.Transactional;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.HashSet;
//import java.util.Set;
//
//@Service
//public class CartService {
//    private String productSize = "sm";
//
//    @Autowired
//    CartRepository cartRepository;
//
//    @Autowired
//    ModelMapper modelMapper;
//
//    @Autowired
//    UserService userService;
//
//    @Autowired
//    ColorService colorService;
//
//    @Autowired
//    ProductSizeService productSizeService;
//
//    @Autowired
//    ProductService productService;
//
//    @Autowired
//    CartProductRepository cartProductRepository;
//
//    @Transactional
//public boolean addToCart(CartRequestDto dto){
//    System.out.println(dto);
//
//    Cart cart = new Cart();
//    cart.setUser(userService.findById(dto.getUser()));
//    cart.setColor(colorService.findByName(dto.getColor()));
////    cart.setProductSize();
//    cartRepository.save(cart);
//
//
//    CartProduct cartProduct = new CartProduct();
//    cartProduct.setQuantity(1);
//    cartProduct.setProduct(productService.findById(dto.getProduct()));
//    cartProduct.setCart(cart);
//    cartProductRepository.save(cartProduct);
//
//    return true;
//}
//
//
//}
