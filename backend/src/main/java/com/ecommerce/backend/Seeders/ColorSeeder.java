package com.ecommerce.backend.Seeders;

import com.ecommerce.backend.models.Color;
import com.ecommerce.backend.services.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ColorSeeder {
    @Autowired
    private ColorService colorService;
    void seedColors() {
        if (colorService.findByName("Black") == null) {
            Color black = new Color();
            black.setName("Black");
            colorService.save(black);
        }
        if (colorService.findByName("White") == null) {
            Color white = new Color();
            white.setName("White");
            colorService.save(white);
        }
        if (colorService.findByName("Pink") == null) {
            Color pink = new Color();
            pink.setName("Pink");
            colorService.save(pink);
        }
    }
}
