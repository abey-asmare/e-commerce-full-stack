package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenderRepository extends JpaRepository<Gender, Long> {
    public Gender findByName(String name);


}
