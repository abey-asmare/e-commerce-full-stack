package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.models.ProductImage;
import com.ecommerce.backend.models.Product;
import com.ecommerce.backend.services.ImageService;
import com.ecommerce.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ImageSeeder {

    @Autowired
    private ImageService imageService;

    @Autowired
    private ProductService productService;

    public void seedImages() {
        List<Product> products = productService.getAllProducts_(); // Fetch all seeded products

        if (!products.isEmpty()) {
            for (Product product : products) {
                // Add primary image
                ProductImage primaryImage = new ProductImage();
                primaryImage.setImageUrl("/images/" + product.getTitle().replace(" ", "-").toLowerCase() + "-primary.jpg");
                primaryImage.setPrimary(true);
                primaryImage.setProduct(product);
                imageService.saveImage(primaryImage);

                // Add secondary images
                for (int i = 1; i <= 3; i++) {
                    ProductImage secondaryImage = new ProductImage();
                    secondaryImage.setImageUrl("/images/" + product.getTitle().replace(" ", "-").toLowerCase() + "-sub" + i + ".jpg");
                    secondaryImage.setPrimary(false);
                    secondaryImage.setProduct(product);
                    imageService.saveImage(secondaryImage);
                }
            }
        }
    }
}
