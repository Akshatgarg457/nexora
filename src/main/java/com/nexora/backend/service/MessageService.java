package com.nexora.backend.service;

import com.nexora.backend.dto.MessageDto;
import com.nexora.backend.dto.SendMessageRequest;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Message;
import com.nexora.backend.repository.EmployeeRepository;
import com.nexora.backend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    public List<MessageDto> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversationBetween(user1Id, user2Id).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(SendMessageRequest request) {
        Employee sender = employeeRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        Employee receiver = employeeRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);
        return mapToDto(saved);
    }

    public MessageDto mapToDto(Message message) {
        if (message == null) return null;
        return MessageDto.builder()
                .id(message.getId())
                .sender(employeeService.mapToDto(message.getSender()))
                .receiver(employeeService.mapToDto(message.getReceiver()))
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .isRead(message.isRead())
                .build();
    }
}
