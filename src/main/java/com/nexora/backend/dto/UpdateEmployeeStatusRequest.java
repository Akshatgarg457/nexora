package com.nexora.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmployeeStatusRequest {
    @NotNull(message = "Active status boolean is required")
    private Boolean active;
}
