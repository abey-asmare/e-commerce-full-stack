package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
        public Optional<Profile> findByUserId(Long userId);
}
