package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Role;
import com.ecommerce.backend.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    RoleRepository roleRepository;

    public Role findByName(String name){
        return roleRepository.findByName(name).
                orElseThrow(() -> new RuntimeException("Role not found: " + name));
    }

    public Role createRole(Role role){
        return roleRepository.save(role);
    }


}
