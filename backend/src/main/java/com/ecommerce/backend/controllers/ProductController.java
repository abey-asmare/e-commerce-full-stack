package com.ecommerce.backend.controllers;

//pagination
import com.ecommerce.backend.DTOs.ProductDetailResponseDto;
import com.ecommerce.backend.DTOs.ProductRequestDto;
import com.ecommerce.backend.DTOs.ProductResponseDto;
import com.ecommerce.backend.models.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Page<ProductResponseDto> getAllProducts( @PageableDefault(size = 10) Pageable pageable){
        return productService.getAllProducts(pageable);
    }

    @GetMapping("/test")
    public String testProducts(){
        return "test api";
    }

    @GetMapping("/alternative")
    public List<Product> getall(){
        List<Product> products = productService.getAllProducts_();
         products.forEach(product -> System.out.println("Product: " + product));
        return products;
    }

    @GetMapping("/{id}")
    public ProductDetailResponseDto getProduct(@PathVariable Long id){
        return productService.getProductDetail(id);
    }


   @PostMapping
    public ResponseEntity<String> createProduct(
            @ModelAttribute ProductRequestDto requestDto,
            @RequestParam("images") List<MultipartFile> images) {
        productService.createProduct(requestDto, images);
        return ResponseEntity.ok("Product created successfully");
    }
}

