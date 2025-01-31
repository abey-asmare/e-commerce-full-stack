package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<User, Long> {

//    public User findByUsername(String username);
    public User findByEmail(String email);

}