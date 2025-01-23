package com.ecommerce.backend.services;

import com.ecommerce.backend.models.ProductImage;
import com.ecommerce.backend.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    public void saveImage(ProductImage image) {
        imageRepository.save(image);
    }


    public List<ProductImage> getImagesForProduct(Long productId) {
        return imageRepository.findByProductId(productId);
    }
}
