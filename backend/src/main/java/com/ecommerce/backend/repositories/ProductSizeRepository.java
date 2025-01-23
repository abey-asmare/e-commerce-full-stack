package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long> {
    public ProductSize findBySize(String size);
}
