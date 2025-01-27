package com.ecommerce.backend.services;

//pagination
import com.ecommerce.backend.DTOs.*;
import com.ecommerce.backend.models.*;
import com.ecommerce.backend.repositories.ImageRepository;
import com.ecommerce.backend.repositories.RelatedProductRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;

import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.nio.file.FileStore;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Filter;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private  ProductRepository productRepository;
    @Autowired
    private  UserService userService;

    @Autowired
    private ProductTypeService productTypeService;

    @Autowired
    private ColorService colorService;

    @Autowired
    private ProductSizeService productSizeService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    private RelatedProductRepository relatedProductRepository;

    @Autowired
    private FileStorageService fileStorageService;
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }


public Page<ProductResponseDto> getAllProducts(String productSize,
                                               Integer minDiscount,
                                               Integer maxDiscount,
                                               Double minPrice,
                                               Double maxPrice,
                                               String gender,
                                               String sortBy,
                                               Pageable pageable) {
    Page<Product> products;
    if (sortBy == null || sortBy.isEmpty()) {
    sortBy = "Newest"; // Default sorting
}

    Sort sort = switch (sortBy) {
        case "price,asc" -> Sort.by("price").ascending();
        case "price,dec" -> Sort.by("price").descending();
        case "newest" -> Sort.by("createdAt").descending();
//        case "topsellers" -> Sort.by("salesCount").descending();
        default -> pageable.getSort(); // Default sorting if no match
    };

    Pageable updatedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

    products = productRepository.findAllByProductSize(productSize, minDiscount, maxDiscount, minPrice, maxPrice, gender, updatedPageable);

    String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

    return products.map(product -> {
        ProductResponseDto dto = modelMapper.map(product, ProductResponseDto.class);

        List<ProductImageResponseDto> imageDtos = product.getImages().stream()
                .map(image -> {
                    ProductImageResponseDto imageDto = new ProductImageResponseDto();
                    imageDto.setId(image.getId());
                    imageDto.setImageUrl(baseUrl + image.getImageUrl());
                    return imageDto;
                })
                .toList();

        dto.setImages(imageDtos);
        return dto;
    });
}


    public ProductDetailResponseDto getProductDetail(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found"); // Or handle with a custom exception
        }
        Product product = productOpt.get();

        // Map Product to ProductDetailResponseDto
        ProductDetailResponseDto responseDto = modelMapper.map(product, ProductDetailResponseDto.class);

        responseDto.setImages(product.getImages().stream()
                .map((image) -> modelMapper.map(image, ProductImageResponseDto.class))
                .collect(Collectors.toList()));

        responseDto.setRelatedProducts(product.getRelatedProducts().stream()
                .map(relatedProduct -> modelMapper.map(relatedProduct, RelatedProductResponseDto.class) )
                .collect(Collectors.toSet()));

        responseDto.setComments(product.getComments().stream()
                .map(comment -> modelMapper.map(comment, CommentResponseDto.class))
                .collect(Collectors.toSet()));

        responseDto.setOwner(product.getOwner().getUsername());
        responseDto.setColorName(product.getColor() != null ? product.getColor().getName() : null);
        responseDto.setProductTypeName(product.getProductType() != null ? product.getProductType().getType() : null);
        responseDto.setSizeName(product.getSizes() != null ? product.getSizes(): null);

        return responseDto;
    }

    public List<Product> getAllProducts_() {
        return productRepository.findAll();
    }
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }


//    create products
//@Transactional
//public void createProduct(ProductRequestDto requestDto, List<MultipartFile> images) {
//    // Fetch and validate related entities
//    User owner = userService.findById(1L); // Replace with authenticated user logic
//    Color color = colorService.findByName(requestDto.getColorName());
//    ProductType productType = productTypeService.findByName(requestDto.getProductTypeName());
//    ProductSize size = requestDto.getSizeName() != null
//            ? productSizeService.findBySize(requestDto.getSizeName())
//            : null;
//
//    // Create the product
//    Product product = new Product();
//    product.setTitle(requestDto.getTitle());
//    product.setDescription(requestDto.getDescription());
//    product.setAvailableQuantity(Integer.valueOf(requestDto.getAvailableQuantity()));
//    product.setOwner(owner);
//    product.setColor(color);
//    product.setProductType(productType);
//    product.setSizes(size);
//    product = productRepository.save(product);
//
//    // Save images
//    if (images != null && !images.isEmpty()) {
//        Product finalProduct = product;
//        List<ProductImage> productImages = new ArrayList<>();
//
//        // Iterate over the images and set 'isPrimary' for the first image
//        for (int i = 0; i < images.size(); i++) {
//            MultipartFile image = images.get(i);
//            String imageUrl = fileStorageService.saveImage(image); // Save the file and return the URL
//
//            ProductImage productImage = new ProductImage();
//            productImage.setImageUrl(imageUrl);
//            productImage.setProduct(finalProduct);
//            productImage.setPrimary(i == 0 ); // First image is set as primary
//
//            productImages.add(productImage);
//        }
//
//        // Save all product images
//        imageRepository.saveAll(productImages);
//    }
//
//    // Save related products
//    if (requestDto.getRelatedProductIds() != null && !requestDto.getRelatedProductIds().isEmpty()) {
//        Product finalProduct1 = product;
//        List<RelatedProduct> relatedProducts = requestDto.getRelatedProductIds().stream()
//                .map(relatedProductId -> {
//                    Product relatedProduct = productRepository.findById(relatedProductId)
//                            .orElseThrow(() -> new RuntimeException("Invalid related product ID: " + relatedProductId));
//                    RelatedProduct relProduct = new RelatedProduct();
//                    relProduct.setProduct(finalProduct1);
//                    relProduct.setRelatedProduct(relatedProduct);
//                    return relProduct;
//                })
//                .collect(Collectors.toList());
//
//        // Save all related products
//        relatedProductRepository.saveAll(relatedProducts);
//    }
//}
//

    public Long countProducts(){
        return productRepository.count();
    }

}
