package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
     Optional<Color> findByName(String name);
}
