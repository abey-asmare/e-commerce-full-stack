//package com.ecommerce.backend.controllers;
//
//import com.ecommerce.backend.models.Message;
//import com.ecommerce.backend.services.MessageService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/messages")
//public class MessageController {
//
//    private final MessageService messageService;
//
//    public MessageController(MessageService messageService) {
//        this.messageService = messageService;
//    }
//
//    @PostMapping
//    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
//        Message savedMessage = messageService.sendMessage(message);
//        return ResponseEntity.ok(savedMessage);
//    }
//
//    @GetMapping("/{senderId}/{receiverId}")
//    public ResponseEntity<List<Message>> getMessages(@PathVariable Long senderId, @PathVariable Long receiverId) {
//        List<Message> messages = messageService.getMessagesBetweenUsers(senderId, receiverId);
//        return ResponseEntity.ok(messages);
//    }
//}
