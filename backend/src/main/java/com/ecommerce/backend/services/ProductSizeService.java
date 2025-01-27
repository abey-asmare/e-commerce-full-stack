package com.ecommerce.backend.services;

import com.ecommerce.backend.models.ProductSize;
import com.ecommerce.backend.repositories.ProductSizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductSizeService {
    @Autowired
    private ProductSizeRepository sizeRepository;


    public ProductSize save(ProductSize size) {
        return sizeRepository.save(size);
    }

    public ProductSize findBySize(String size) {
        return sizeRepository.findBySize(size);
    }

    public List<ProductSize> getAll() {
        return sizeRepository.findAll();
    }
}
