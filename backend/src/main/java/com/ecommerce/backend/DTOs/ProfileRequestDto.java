package com.ecommerce.backend.DTOs;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProfileRequestDto {
    private MultipartFile avatar;

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    @NotNull(message = "User ID is required")
    private Long user_id;

    @Pattern(regexp = "\\+?[0-9. ()-]{7,25}", message = "Please enter a valid phone number")
    private String phone;

    private String location;
}
