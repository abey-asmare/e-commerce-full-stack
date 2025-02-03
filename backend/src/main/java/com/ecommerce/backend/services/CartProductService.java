package com.ecommerce.backend.services;

import com.ecommerce.backend.repositories.CartProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartProductService {
    @Autowired
    private CartProductRepository cartProductRepository;

}
