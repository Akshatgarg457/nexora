package com.nexora.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReportRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;
    @NotNull(message = "Author ID is required")
    private Long authorId;
    @NotBlank(message = "Summary is required")
    private String summary;
    private Integer progressPercentage;
    private String blockers;
}
