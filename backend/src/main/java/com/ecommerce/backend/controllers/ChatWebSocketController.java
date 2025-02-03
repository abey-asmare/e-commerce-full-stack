package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.Message;
import com.ecommerce.backend.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(Message message) {
        return messageService.saveMessage(message);
    }
}