package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.models.*;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;


@Component
public class ProductSeeder {

    @Autowired
    private ProductService productService;
     public void seedProducts(List<User> users,
                                  List<Color> colors,
                                  List<ProductType> productTypes,
                                  List<ProductSize> productSizes) {
//
//        if (!users.isEmpty() &&
//                !colors.isEmpty() &&
//                !productTypes.isEmpty() &&
//                !productSizes.isEmpty() && productService.countProducts() <= 12) {
//
//            User owner = users.stream()
//                  .filter(User::isAdmin )
//                  .findFirst()
//                  .orElseThrow(()-> new RuntimeException("no admin exists in the database"));
//            Color color = colors.get(0); // Pick first color
//            ProductType productType = productTypes.get(0); // Pick first product type
//            ProductSize size = productSizes.get(0); // Pick first product size
//
//            // Product 1
//            Product product = new Product();
//            product.setTitle("Black T-Shirt");
//            product.setDescription("A stylish black t-shirt for men.");
//            product.setOwner(owner);
//            product.setColor(color);
//            product.setProductType(productType);
//            product.setSize(size);
//            product.setAvailableQuantity(3);
//            product.setUpdatedAt(LocalDateTime.now());
//            productService.saveProduct(product);
//
//            // Product 2 (example with stock label)
//            Product product2 = new Product();
//            product2.setTitle("Red T-Shirt");
//            product2.setDescription("A vibrant red t-shirt for casual wear.");
//            product2.setOwner(owner);
//            product2.setColor(color);
//            product2.setProductType(productType);
//            product2.setSize(size);
//            product2.setAvailableQuantity(2); // Low stock
//            product2.setUpdatedAt(LocalDateTime.now().minusDays(10)); // Received 10 days ago
//            productService.saveProduct(product2);
//    }
     }
}
