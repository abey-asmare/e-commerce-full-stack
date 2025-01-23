package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Color;
import com.ecommerce.backend.repositories.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorService {
    @Autowired
    private ColorRepository colorRepository;

    public Color save(Color color) {
        return colorRepository.save(color);
    }

    public List<Color> getAll(){
        return colorRepository.findAll();
    }

    public Color findByName(String colorName) {
        return colorRepository.findByName(colorName)
                .orElseThrow(() -> new RuntimeException("Color not found with name: " + colorName));
    }



}
