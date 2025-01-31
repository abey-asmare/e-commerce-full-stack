package com.ecommerce.backend.controllers;

import com.ecommerce.backend.DTOs.LoginDto;
import com.ecommerce.backend.DTOs.RegisterDto;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.AppUserRepository;
import com.ecommerce.backend.services.RoleService;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;

@RequestMapping("/api/v1/account")
@RestController
public class AccountController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RoleService roleService;

    @Value("${security.jwt.secret-key}")
    private String jwtSecretKey;

    @Value("${security.jwt.issuer}")
    private String jwtIssuer;

    @Autowired
    private AppUserRepository appUserRepository;

    @PostMapping("/register")
    public ResponseEntity<Object> register(
            @Valid @RequestBody RegisterDto registerDto,
            BindingResult result
    ) {
        if (result.hasErrors()) {
            var errorsList = result.getAllErrors();
            var errorsMap = new HashMap<String, String>();

            for (var error : errorsList) {
                var fieldError = (FieldError) error;
                errorsMap.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(errorsMap);
        }

        var bCryptEncoder = new BCryptPasswordEncoder();

        User appUser = new User();
        appUser.setFirstname(registerDto.getFirstName());
        appUser.setLastname(registerDto.getLastName());
        appUser.setEmail(registerDto.getEmail());
        appUser.setRole(roleService.findByName("ROLE_USER"));
        appUser.setPassword(bCryptEncoder.encode(registerDto.getPassword()));

        try {
            var otherUser = appUserRepository.findByEmail(registerDto.getEmail());
            if (otherUser != null) {
                return ResponseEntity.badRequest().body("Email address already used");
            }

            appUserRepository.save(appUser);

            String accessToken = createAccessToken(appUser);
            String refreshToken = createRefreshToken(appUser);

            var response = new HashMap<String, Object>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return ResponseEntity.badRequest().body("Error occurred");
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @Valid @RequestBody LoginDto loginDto,
            BindingResult result
    ) {
        if (result.hasErrors()) {
            var errorsMap = new HashMap<String, String>();

            for (var error : result.getAllErrors()) {
                var fieldError = (FieldError) error;
                errorsMap.put(fieldError.getField(), fieldError.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(errorsMap);
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginDto.getEmail(),
                    loginDto.getPassword()
                )
            );

            User appUser = appUserRepository.findByEmail(loginDto.getEmail());
            String accessToken = createAccessToken(appUser);
            String refreshToken = createRefreshToken(appUser);

            var response = new HashMap<String, Object>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            ResponseEntity.badRequest().body("Invalid username or password");
        }

        return ResponseEntity.badRequest().body("Invalid username or password");
    }

    @PostMapping("/refresh-token")
public ResponseEntity<Object> refreshToken(@RequestBody HashMap<String, String> request) {
    String refreshToken = request.get("refreshToken");

    if (refreshToken == null || refreshToken.isEmpty()) {
        return ResponseEntity.badRequest().body("Refresh token is required");
    }

    try {
        var decoder = NimbusJwtDecoder.withSecretKey(new SecretKeySpec(jwtSecretKey.getBytes(), "HmacSHA256")).build();
        var jwt = decoder.decode(refreshToken);

        String email = jwt.getClaim("email"); // Get email claim from token
        User appUser = appUserRepository.findByEmail(email);

        if (appUser == null) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }

        String newAccessToken = createAccessToken(appUser);

        var response = new HashMap<String, Object>();
        response.put("accessToken", newAccessToken);

        return ResponseEntity.ok(response);

    } catch (Exception ex) {
        return ResponseEntity.badRequest().body("Invalid refresh token");
    }
}

    private String createAccessToken(User appUser) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(jwtIssuer)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(900)) // 15 minutes
                .subject(appUser.getEmail())
                .claim("role", appUser.getRole().getName())
                .claim("profile", appUser.getProfileAvatar())
                .claim("phone", appUser.getPhone())
                .claim("location", appUser.getLocation())
                .claim("bio", appUser.getBio())
                .claim("email", appUser.getEmail())
                .claim("id", appUser.getId())
                .claim("carts", appUser.getCarts())
                .claim("favorites", appUser.getFavorites())
                .claim("isAdmin", appUser.isAdmin())
                .claim("firstName", appUser.getFirstname())
                .claim("lastName", appUser.getLastname())
                .claim("id", appUser.getId())
                .build();

        var encoder = new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey.getBytes()));
        var params = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims);

        return encoder.encode(params).getTokenValue();
    }

    private String createRefreshToken(User appUser) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(jwtIssuer)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(7 * 24 * 3600)) // 7 days
                .subject(appUser.getEmail())
                .claim("email", appUser.getEmail())
                .build();

        var encoder = new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey.getBytes()));
        var params = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims);

        return encoder.encode(params).getTokenValue();
    }
}
