package com.ecommerce.backend.controllers;

import com.ecommerce.backend.DTOs.CommentRequestDto;
import com.ecommerce.backend.models.Comment;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {
    @PostMapping
    public void addComment(@Valid @RequestBody CommentRequestDto requestDto){
        System.out.println(requestDto);
    }
}
