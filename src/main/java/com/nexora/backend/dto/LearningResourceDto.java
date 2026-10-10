package com.nexora.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningResourceDto {
    private Long id;
    private String title;
    private String category;
    private String description;
    private String resourceUrl;
    private String estimatedTime;
    private String level;
    private String sampleTranscript;
}
