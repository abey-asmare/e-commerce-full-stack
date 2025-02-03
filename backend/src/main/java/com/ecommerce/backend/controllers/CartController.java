//package com.ecommerce.backend.controllers;
//
//
//import com.ecommerce.backend.DTOs.CartRequestDto;
//import com.ecommerce.backend.services.CartService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//
//@RequestMapping("/api/v1/carts")
//public class CartController {
//
//
//    @Autowired
//    CartService cartService;
//    @PostMapping
//    public ResponseEntity<String> addToCart(@RequestBody CartRequestDto dto){
//        System.out.println("dto" + dto);
//        boolean isSaved = cartService.addToCart(dto);
//        return isSaved ? new ResponseEntity<String>("Cart added successfully", HttpStatus.CREATED):
//                 new ResponseEntity<String>("something is wrong creating your cart", HttpStatus.BAD_REQUEST);
//
//    }
//}
