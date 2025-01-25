package com.ecommerce.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Entity
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    private String imageUrl;
    private boolean isPrimary;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference // Prevents infinite recursion when serializing the ProductImage
    private Product product;

}
