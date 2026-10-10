package com.nexora.backend.dto;

import com.nexora.backend.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {
    private Long id;
    private String name;
    private String email;
    private String avatar;
    private Role role;
    private String department;
    private String position;
    private String status;
    private boolean active;
}
