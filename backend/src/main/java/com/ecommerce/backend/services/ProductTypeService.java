package com.ecommerce.backend.services;

import com.ecommerce.backend.models.ProductType;
import com.ecommerce.backend.repositories.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductTypeService {

    @Autowired
    private  ProductTypeRepository productTypeRepository;

    public ProductType saveProductType(ProductType productType) {
        return productTypeRepository.save(productType);
    }

    public ProductType findByName(String name) {
        return productTypeRepository.findByType(name);
    }

    public List<ProductType> getAll(){
        return productTypeRepository.findAll();
    }
}
