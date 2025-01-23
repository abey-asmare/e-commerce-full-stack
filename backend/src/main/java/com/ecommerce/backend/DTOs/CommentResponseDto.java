package com.ecommerce.backend.DTOs;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
public class CommentResponseDto {
    private Long id;
    private String content;
    private String commenterName;
    private LocalDateTime commentedAt;
}