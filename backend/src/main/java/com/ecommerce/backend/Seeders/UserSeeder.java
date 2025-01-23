package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.DTOs.UserRegistrationDto;
import com.ecommerce.backend.models.Role;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.RoleRepository;
import com.ecommerce.backend.repositories.UserRepository;
import com.ecommerce.backend.services.RoleService;
import com.ecommerce.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.webauthn.api.UserVerificationRequirement;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class UserSeeder {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void seedUsers() {
        // Fetch roles
        Role roleUser = roleService.findByName("ROLE_USER");
        Role roleAdmin = roleService.findByName("ROLE_ADMIN");

        // Seed ROLE_USER users
        // using userRepository just to have some flexibility to seed the data
        // instead of the userRegistreationDto.
//        for (int i = 1; i <= 3; i++) {
//            User user = new User();
//            user.setFirstname("User" + i);
//            user.setLastname("Test" + i);
//            user.setEmail("user" + i + "@example.com");
//            user.setPassword(passwordEncoder.encode("userpass"));
//            user.setRole(roleUser);
//            userRepository.save(user);
//        }

        // Seed ROLE_ADMIN user
        User admin = new User();
        admin.setFirstname("Admin");
        admin.setLastname("User");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("adminpass"));
        admin.setRole(roleAdmin);
        userRepository.save(admin);

        System.out.println("Users seeded successfully!");
    }
}
