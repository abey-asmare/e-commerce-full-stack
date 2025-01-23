package com.ecommerce.backend.Seeders;


import com.ecommerce.backend.models.ProductSize;
import com.ecommerce.backend.services.ProductSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductSizeSeeder {

    @Autowired
    private ProductSizeService productSizeService;

    private static final String[] SIZES = {"Sm", "Md", "Lg", "XL", "2XL"};

    public void seedProductSize(){
//        for (String size : SIZES) {
//            if(productSizeService.findBySize(size) == null){
//                ProductSize p = new ProductSize();
//                p.setSize(size);
//                productSizeService.save(p);
//            }
//
//        }
    }


}
