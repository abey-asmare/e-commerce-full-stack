package com.ecommerce.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

// Cart Entity
@Data
@RequiredArgsConstructor
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private Set<CartProduct> cartProducts = new HashSet<>();

    @ManyToOne
    @JoinColumn(nullable = false)
    @JsonManagedReference
    private Color color;

    @ManyToOne
    @JoinColumn(nullable = false)
    @JsonManagedReference
    private ProductSize productSize;

}
