package com.nexora.backend.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenceDto {
    private Long id;
    private Long employeeId;
    private String customPrompt;
    private List<String> prioritizedWorkspaces;
    private String explanationText;
}
