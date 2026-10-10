package com.nexora.backend.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiResponseDto {
    private String response;
    private String source; // e.g., "Nexora AI Assistant (Simulated Prototype Service)"
    private String targetWorkspace; // optional navigation hint: MEETINGS, COMMUNICATION, STUDY, PROJECTS, ANALYTICS
    private List<String> suggestedActions;
    private boolean isSimulated;
}
