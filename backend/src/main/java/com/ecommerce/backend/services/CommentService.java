package com.ecommerce.backend.services;


import com.ecommerce.backend.DTOs.CommentRequestDto;
import com.ecommerce.backend.models.Comment;
import com.ecommerce.backend.repositories.CommentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    ModelMapper modelMapper;

    public Comment get(Long id){
        return commentRepository.findById(id).orElseThrow(()-> new RuntimeException("comment does not exist"));
    }

    public Comment addComment(CommentRequestDto commentRequestDto){
        Comment comment  = modelMapper.map(commentRequestDto, Comment.class);
        comment.setLikes(0);
        comment.setDislikes(0);
        comment.setReplies(new ArrayList<>());
        commentRepository.save(comment);
        return comment;
    }

}
