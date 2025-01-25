package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Long> {
    ProductType findByType(String type);
}
