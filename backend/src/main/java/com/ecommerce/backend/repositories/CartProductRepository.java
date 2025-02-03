package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.CartProduct;
import com.ecommerce.backend.services.CartProductService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartProductRepository  extends JpaRepository<CartProduct, Long> {
}
