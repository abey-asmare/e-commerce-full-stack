package com.ecommerce.backend.DTOs;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data

public class RegisterDto {

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

//    @NotEmpty
//    private String username;

    @NotEmpty
    private String email;

//    private String phone;
//    private String address;

    @NotEmpty
    @Size(min = 6, message = "Minimum Password length is 6 characters")
    private String password;
}
