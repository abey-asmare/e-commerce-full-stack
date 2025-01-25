package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.models.ProductType;
import com.ecommerce.backend.services.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ProductTypeSeeder {
    @Autowired
    private ProductTypeService productTypeService;


    public void seedProductTypes() {
        // explicitly adding only one product, if it is not added yet
        if (productTypeService.findByName("T-shirt") == null) {
            ProductType productType = new ProductType();
            productType.setType("T-shirt");
            productTypeService.saveProductType(productType);
        }
    }
}
