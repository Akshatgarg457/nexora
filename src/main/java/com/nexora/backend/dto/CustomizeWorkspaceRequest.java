package com.nexora.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomizeWorkspaceRequest {
    private Long employeeId;
    @NotBlank(message = "Prompt is required")
    private String prompt;
}
