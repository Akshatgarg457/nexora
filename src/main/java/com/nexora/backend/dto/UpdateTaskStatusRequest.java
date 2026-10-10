package com.nexora.backend.dto;

import com.nexora.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTaskStatusRequest {
    @NotNull(message = "Task status is required")
    private TaskStatus status;
}
