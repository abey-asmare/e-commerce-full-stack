package com.ecommerce.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

// CartProduct Entity
@Data
@RequiredArgsConstructor
@Entity
public class CartProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonManagedReference
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonManagedReference
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;
}