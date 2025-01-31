package com.ecommerce.backend.controllers;

//pagination
import com.ecommerce.backend.DTOs.ProductDetailResponseDto;
import com.ecommerce.backend.DTOs.ProductRequestDto;
import com.ecommerce.backend.DTOs.ProductResponseDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Page<ProductResponseDto> getAllProducts(
                                                    @RequestParam(required = false) String productSize,
                                                    @RequestParam(required = false) Integer minDiscount,
                                                    @RequestParam(required = false) Integer maxDiscount,
                                                    @RequestParam(required = false) Double minPrice,
                                                    @RequestParam(required = false) Double maxPrice,
                                                    @RequestParam(required = false) String gender,
                                                    @RequestParam(required = false) String sortBy,
                                                    @PageableDefault(size = 10) Pageable pageable
                                                    ){
        return productService.getAllProducts(productSize, minDiscount, maxDiscount,minPrice, maxPrice,  gender,  sortBy, pageable);
    }
    @GetMapping("/{id}")
    public ProductDetailResponseDto getProduct(@PathVariable Long id){
        return productService.getProductDetail(id);
    }


   @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(
            @Valid @ModelAttribute ProductRequestDto requestDto,
            @RequestParam("images") List<MultipartFile> images) {
        ProductResponseDto product = productService.createProduct(requestDto, images);
        return new ResponseEntity<ProductResponseDto>(product, HttpStatus.CREATED);
    }
}

