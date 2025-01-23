package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.RelatedProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RelatedProductRepository extends JpaRepository<RelatedProduct, Long> {
}
