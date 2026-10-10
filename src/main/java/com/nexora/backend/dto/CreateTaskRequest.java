package com.nexora.backend.dto;

import com.nexora.backend.entity.TaskPriority;
import com.nexora.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTaskRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;
    @NotBlank(message = "Task title is required")
    private String title;
    private String description;
    private Long assigneeId;
    @NotNull(message = "Status is required")
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
}
