package com.nexora.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private Long id;
    private EmployeeDto sender;
    private EmployeeDto receiver;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
}
