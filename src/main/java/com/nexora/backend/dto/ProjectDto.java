package com.nexora.backend.dto;

import com.nexora.backend.entity.ProjectStatus;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private EmployeeDto manager;
    private Integer completionPercentage;
}
