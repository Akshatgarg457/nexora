package com.nexora.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRequestDto {
    private String prompt;
    private Long employeeId;
    private String activeWorkspace;
}
