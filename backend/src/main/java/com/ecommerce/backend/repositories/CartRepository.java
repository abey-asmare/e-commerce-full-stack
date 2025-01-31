package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
