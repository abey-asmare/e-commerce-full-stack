package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductId(Long productId);

    boolean findByImageUrlContains(String pattern);

}
