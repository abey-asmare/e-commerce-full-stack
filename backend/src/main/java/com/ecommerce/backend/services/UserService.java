package com.ecommerce.backend.services;


import com.ecommerce.backend.DTOs.UserRegistrationDto;
import com.ecommerce.backend.models.Profile;
import com.ecommerce.backend.models.Role;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private RoleService roleService;


    @Autowired
    private PasswordEncoder  passwordEncoder;

    @Autowired
    ModelMapper modelMapper;


    public List<User> getAll(){
        return userRepository.findAll();
    }


    public User registerUser(UserRegistrationDto userRegistrationDto, String roleName) {
        Role role = roleService.findByName(roleName);
//        User user = new User();
//        user.setFirstname(userRegistrationDto.getFirstname());
//        user.setLastname(userRegistrationDto.getLastname());
//        user.setEmail(userRegistrationDto.getEmail());
//        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        User user = modelMapper.map(userRegistrationDto, User.class);
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setRole(role);

        return userRepository.save(user);
    }

    public Long countUsers(){
        return userRepository.count();
    }

    public User findById(Long id){
        return userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found with name: " + id));
    }





}
