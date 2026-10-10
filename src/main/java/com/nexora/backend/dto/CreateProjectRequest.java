package com.nexora.backend.dto;

import com.nexora.backend.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProjectRequest {
    @NotBlank(message = "Project name is required")
    private String name;
    private String description;
    private String category;
    @NotNull(message = "Status is required")
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    @NotNull(message = "Manager ID is required")
    private Long managerId;
    private Integer completionPercentage;
}
