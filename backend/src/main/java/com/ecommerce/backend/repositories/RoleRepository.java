package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    public List<Role> findAllByName(String name);
    Optional<Role> findByName(String name);





}
