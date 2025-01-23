package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.services.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class SeedDatabase {

//    seeders
    @Autowired
    private RoleSeeder roleSeeder;
    @Autowired
    private UserSeeder userSeeder;

    @Autowired
    private ProductTypeSeeder productTypeSeeder;
    @Autowired
    private ProductSizeSeeder productSizeSeeder;
    @Autowired
    private ColorSeeder colorSeeder;
    @Autowired
    private ProductSeeder productSeeder;
    @Autowired
    private ImageSeeder imageSeeder;



//    services
    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;
    @Autowired
    private ColorService colorService;

    @Autowired
    private ProductTypeService productTypeService;

    @Autowired
    private ProductSizeService productSizeService;


//    @PostConstruct
    public void seedDatabase() {
        if (userService.countUsers() == 0) {
            roleSeeder.seedRoles();
            userSeeder.seedUsers();
        }

        productTypeSeeder.seedProductTypes();
        productSizeSeeder.seedProductSize();
        colorSeeder.seedColors();
        productSeeder.seedProducts(
                userService.getAll(),
                colorService.getAll(),
                productTypeService.getAll(),
                productSizeService.getAll()
                );
        imageSeeder.seedImages();
    }
}
