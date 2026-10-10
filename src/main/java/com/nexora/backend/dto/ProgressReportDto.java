package com.nexora.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressReportDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private EmployeeDto author;
    private String summary;
    private LocalDateTime reportDate;
    private Integer progressPercentage;
    private String blockers;
}
