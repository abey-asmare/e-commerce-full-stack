package com.ecommerce.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

// Size Entity
@Data
@RequiredArgsConstructor
@Entity
public class ProductSize {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private String size;

    @ManyToMany(mappedBy = "sizes")
    @JsonIgnore
    private Set<Product> products = new HashSet<>();
}