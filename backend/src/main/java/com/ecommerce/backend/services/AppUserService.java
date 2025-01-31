package com.ecommerce.backend.services;


import com.ecommerce.backend.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserService implements UserDetailsService {

    @Autowired
    private AppUserRepository repo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
         com.ecommerce.backend.models.User appUser = repo.findByEmail(email);

        if (appUser != null) {
            var springUser = User.withUsername(appUser.getUsername())
                    .password(appUser.getPassword())
                    .roles("USER")
                    .build();

            return springUser;
        }

        return null;
    }
}
