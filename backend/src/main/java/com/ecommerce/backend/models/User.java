package com.ecommerce.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

// User Entity
@Data
@RequiredArgsConstructor
@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "First name is required")
    private String firstname;

    @Column(nullable = false)
     @NotBlank(message = "Last name is required")
    private String lastname;

    @Column(nullable = false, unique = true)
    @Email(message = "Please enter a valid email address")
    @NotBlank(message = "Email is required")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Profile profile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Favorites> favorites = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private Set<Cart> carts = new HashSet<>();

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;


    // is user admin or not
    public boolean isAdmin(){
            if (this.getRole() == null) {
            return false;
        }

        if (this.getRole() instanceof HibernateProxy) {
            // The Role is still a proxy, we need to initialize it
            Hibernate.initialize(this.getRole());
        }
    return Objects.equals(this.getRole().getName(), "ROLE_ADMIN");
    }

    public String getUsername() {
        return getFirstname() + " " +  getLastname();
    }

    @Override
    public String toString() {
        return "User{" +
                "firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                '}';
    }

public String getProfileAvatar() {
    String avatarPath = (this.getProfile() == null || this.getProfile().getAvatar() == null)
        ? "images/profiles/default_profile_picture.jpg"
        :  this.getProfile().getAvatar();

    return ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/" + avatarPath;
}

public String getLocation(){
        if(this.getProfile() == null || this.getProfile().getLocation() == null){
            return "";
        }
        return this.getProfile().getLocation();

}

public String getPhone(){
        if(this.getProfile() == null || this.getProfile().getPhone() == null){
            return "";
        }
        return this.getProfile().getPhone();

}

public String getBio(){
        if(this.getProfile() == null || this.getProfile().getBio() == null){
            return "";
        }
        return this.getProfile().getBio();

}
}

