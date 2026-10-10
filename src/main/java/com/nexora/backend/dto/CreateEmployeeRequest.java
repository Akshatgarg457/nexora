package com.nexora.backend.dto;

import com.nexora.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmployeeRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String password; // optional; if empty, a temporary password is generated safely

    @NotNull(message = "Role is required")
    private Role role;

    private String department;
    private String position;
    private String avatar;
}
