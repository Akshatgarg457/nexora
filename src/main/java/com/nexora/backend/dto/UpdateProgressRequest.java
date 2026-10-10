package com.nexora.backend.dto;

import com.nexora.backend.entity.LearningStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProgressRequest {
    private Long employeeId;
    private Long resourceId;
    private LearningStatus status;
    private Integer progressPercentage;
    private String videoNotes;
    private Boolean generateAiSummary;
}
