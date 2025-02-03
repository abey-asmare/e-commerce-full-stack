package com.ecommerce.backend.controllers;

//pagination
import com.ecommerce.backend.DTOs.ProductDetailResponseDto;
import com.ecommerce.backend.DTOs.ProductRequestDto;
import com.ecommerce.backend.DTOs.ProductResponseDto;
import com.ecommerce.backend.SemanticWeb.SparqlService;
import com.ecommerce.backend.models.Product;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private SparqlService sparqlService;

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

   @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @ModelAttribute ProductRequestDto requestDto,
            @RequestParam("images") List<MultipartFile> images) {
        ProductResponseDto product = productService.updateProduct(id, requestDto, images);
        return new ResponseEntity<ProductResponseDto>(product, HttpStatus.OK);
    }

@GetMapping("/load")
public String loadProductData() {
    List<Product> products = productService.getAllProducts_();
    if (products.isEmpty()) {
        return "No products found in the database!";
    }

    sparqlService.loadProductData(products);
    System.out.println("RDF Model Loaded with " + products.size() + " products");
    return "Product data loaded into RDF model!";
}

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable Long id){
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }


    @GetMapping("/search")
    public String searchProduct(@RequestParam String keyword) {
        String sparqlQuery = "PREFIX ex: <http://example.com/products/> " +
                "SELECT ?title ?description ?price WHERE { " +
                "?product ex:title ?title . " +
                "?product ex:description ?description . " +
                "?product ex:price ?price . " +
                "FILTER(CONTAINS(LCASE(?title), \"" + keyword.toLowerCase() + "\")) " +
                "}";

        return sparqlService.executeQuery(sparqlQuery);
    }

}

