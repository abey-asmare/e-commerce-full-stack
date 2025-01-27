package com.ecommerce.backend.repositories;

import com.ecommerce.backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images")
    Page<Product> findAllWithImages(Pageable pageable);

    @Query("""
           SELECT p FROM Product p
           LEFT JOIN FETCH p.images
           LEFT JOIN p.sizes s
           WHERE (:gender IS NULL OR p.gender.name = :gender)
           AND ((:productSize IS NULL OR :productSize = '') OR s.size = :productSize)
           AND (:minDiscount IS NULL OR p.discountedPercentage >= :minDiscount)
           AND (:maxDiscount IS NULL OR p.discountedPercentage <= :maxDiscount)
           AND (:minPrice IS NULL OR p.price >= :minPrice)
           AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                """)
    Page<Product> findAllByProductSize(@Param("productSize") String productSize,
                                       @Param("minDiscount") Integer minDiscount,
                                       @Param("maxDiscount") Integer maxDiscount,
                                       @Param("minPrice") Double minPrice,
                                       @Param("maxPrice") Double maxPrice,
                                       @Param("gender") String gender,
                                       Pageable pageable);


}

