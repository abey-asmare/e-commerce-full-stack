package com.ecommerce.backend.services;


import com.ecommerce.backend.DTOs.*;
import com.ecommerce.backend.models.*;
import com.ecommerce.backend.repositories.ImageRepository;
import com.ecommerce.backend.repositories.RelatedProductRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;

import com.ecommerce.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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


import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
    private GenderService genderService;

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
    sortBy = "newest"; // Default sorting
}

    Sort sort = switch (sortBy) {
        case "price,asc" -> Sort.by("price").ascending();
        case "price,dec" -> Sort.by("price").descending();
        case "newest" -> Sort.by("createdAt").descending();
//        case "topsellers" -> Sort.by("salesCount").descending();
        default -> Sort.by("createdAt").descending();
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

@Transactional

    public ProductDetailResponseDto getProductDetail(Long productId) {


    String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        Product product = productOpt.get();

        // Map Product to ProductDetailResponseDto
        ProductDetailResponseDto responseDto = modelMapper.map(product, ProductDetailResponseDto.class);


        List<ProductImageResponseDto> imageDtos = product.getImages().stream()
                .map(image -> {
                    ProductImageResponseDto imageDto = new ProductImageResponseDto();
                    imageDto.setId(image.getId());
                    imageDto.setImageUrl(baseUrl + image.getImageUrl());
                    return imageDto;
                })
                .toList();

        responseDto.setRelatedProducts(product.getRelatedProducts().stream()
                .map(relatedProduct -> modelMapper.map(relatedProduct, RelatedProductResponseDto.class) )
                .collect(Collectors.toSet()));

//        responseDto.setComments(product.getComments().stream()
//                .map(comment -> modelMapper.map(comment, CommentResponseDto.class))
//                .collect(Collectors.toList()));
        responseDto.setSizeName(product.getSizes() != null ? product.getSizes(): null);
        responseDto.setOwner(product.getOwner().getUsername());
        responseDto.setColorName(product.getColor() != null ? product.getColor().getName() : null);
        responseDto.setProductTypeName(product.getProductType() != null ? product.getProductType().getType() : null);
        responseDto.setImages(imageDtos);

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
@Transactional
public ProductResponseDto createProduct(ProductRequestDto requestDto, List<MultipartFile> images) {

    // Fetch and validate related entities
    User owner = userService.findById(1L); // Hardcoded admin user
    Color color = colorService.findByName(requestDto.getColorName());
    ProductType productType = productTypeService.findByName(requestDto.getProductTypeName());
    Gender gender = genderService.findByName(requestDto.getGender());

    // Validate and map sizes
    List<ProductSize> sizes = requestDto.getSizeNames().stream()
        .map(size -> productSizeService.findBySize(size))
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
    if (sizes.isEmpty()) {
        throw new RuntimeException("Invalid size names provided");
    }

    // Create the product
    Product product = new Product();
    product.setTitle(requestDto.getTitle());
    product.setGender(gender);
    product.setPrice(requestDto.getPrice());
    product.setDescription(requestDto.getDescription());
    System.out.println(requestDto);
    if(requestDto.getAvailableQuantity() == null || requestDto.getAvailableQuantity() <=0)
        product.setAvailableQuantity(1);
    product.setAvailableQuantity(requestDto.getAvailableQuantity());
    product.setDiscountedPercentage(0);
    product.setOwner(owner);
    product.setColor(color);
    product.setProductType(productType);
    product.setSizes(sizes);

    product = productRepository.save(product);


    // Save images
    if (images != null && !images.isEmpty()) {
        saveProductImages(product, images);
    }

    // Save related products
    if (requestDto.getRelatedProductIds() != null && !requestDto.getRelatedProductIds().isEmpty()) {
//        saveRelatedProducts(product, requestDto.getRelatedProductIds());
    }

    System.out.println("product created successfully");
    return modelMapper.map(product, ProductResponseDto.class);
}

private void saveProductImages(Product product, List<MultipartFile> images) {
    List<ProductImage> productImages = new ArrayList<>();
    for (int i = 0; i < images.size(); i++) {
        MultipartFile image = images.get(i);

        String imageUrl = fileStorageService.saveImage(image);
        ProductImage productImage = new ProductImage();
        productImage.setImageUrl(imageUrl);
        productImage.setProduct(product);
        productImage.setPrimary(i == 0); // First image is primary
        productImages.add(productImage);
    }
    imageRepository.saveAll(productImages);
//}

//    private void saveRelatedProducts(Product product, List<Long> relatedProductIds) {
//    List<RelatedProduct> relatedProducts = relatedProductIds.stream()
//        .map(relatedProductId -> {
//            Product relatedProduct = productRepository.findById(relatedProductId)
//                .orElseThrow(() -> new InvalidRelatedProductException("Invalid related product ID: " + relatedProductId));
//            RelatedProduct relProduct = new RelatedProduct();
//            relProduct.setProduct(product);
//            relProduct.setRelatedProduct(relatedProduct);
//            return relProduct;
//        })
//        .collect(Collectors.toList());
//    relatedProductRepository.saveAll(relatedProducts);
//    log.info("Related products saved for product ID: {}", product.getId());
}


    public Long countProducts(){
        return productRepository.count();
    }

}
