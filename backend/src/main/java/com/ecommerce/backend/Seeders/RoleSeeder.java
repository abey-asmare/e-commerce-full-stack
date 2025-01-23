package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.models.Role;
import com.ecommerce.backend.repositories.RoleRepository;
import com.ecommerce.backend.services.RoleService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder {

    @Autowired
    private RoleService roleService;

        public void seedRoles() {
            try {
                roleService.findByName("ROLE_USER");
            } catch (RuntimeException e) {
                Role userRole = new Role();
                userRole.setName("ROLE_USER");
                roleService.createRole(userRole);
            }

            try {
                roleService.findByName("ROLE_ADMIN");
            } catch (RuntimeException e) {
                Role adminRole = new Role();
                adminRole.setName("ROLE_ADMIN");
                roleService.createRole(adminRole);
            }
        }

}
