package com.ecommerce.backend.DTOs;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequestDto {
    @NotBlank(message = "comment content is required")
    private String content;
    @NotNull(message = "userid is required")
    private Long userId;
    @NotNull(message = "productId is required")
    private Long productId;
    private Long parentCommentId;

}
