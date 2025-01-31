package com.ecommerce.backend.controllers;


import com.ecommerce.backend.DTOs.ProfileRequestDto;
import com.ecommerce.backend.services.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.spec.SecretKeySpec;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController{

    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT is missing");
        }
        return ResponseEntity.ok("Authenticated user: " + jwt.getSubject());
    }


      @Autowired
    private ProfileService profileService;

    @Value("${security.jwt.secret-key}")
    private String jwtSecretKey;

    @Value("${security.jwt.issuer}")
    private String jwtIssuer;


@PostMapping("/{id}")
public ResponseEntity<?> createOrUpdate(
        @PathVariable Long id,
        @Valid @ModelAttribute ProfileRequestDto profileRequestDto,
        @AuthenticationPrincipal Jwt jwt) {

    if (jwt == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT is missing");
    }

    Number userIdFromToken = jwt.getClaim("id");
    Long userId = userIdFromToken.longValue();

    if (!userId.equals(id)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized to update this profile");
    }

    boolean success = profileService.createOrUpdate(
            id,
            profileRequestDto.getAvatar(),
            profileRequestDto.getBio(),
            profileRequestDto.getLocation(),
            profileRequestDto.getPhone());

    return success ? ResponseEntity.ok(id)
                   : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile");
}



}