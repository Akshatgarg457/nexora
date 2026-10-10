package com.nexora.backend.dto;

import com.nexora.backend.entity.LearningStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningProgressDto {
    private Long id;
    private Long employeeId;
    private LearningResourceDto resource;
    private LearningStatus status;
    private Integer progressPercentage;
    private String videoNotes;
    private String aiSummary;
    private LocalDateTime lastAccessed;
}
