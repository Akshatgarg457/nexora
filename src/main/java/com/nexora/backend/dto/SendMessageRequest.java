package com.nexora.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {
    @NotNull(message = "Sender ID is required")
    private Long senderId;
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    @NotBlank(message = "Message content is required")
    private String content;
}
