package com.nexora.backend.dto;

import com.nexora.backend.entity.TaskPriority;
import com.nexora.backend.entity.TaskStatus;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private String title;
    private String description;
    private EmployeeDto assignee;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private boolean isOverdue;
}
