package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Gender;
import com.ecommerce.backend.repositories.GenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class GenderService {
    @Autowired
    private GenderRepository genderRepository;

    public Gender findById(Long id){
        return genderRepository.findById(id).orElseThrow();
    }

    public Gender findByName(String name){
        return genderRepository.findByName(name);
    }

    public List<Gender> getAll(){
        return genderRepository.findAll();
    }

}
