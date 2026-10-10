package com.nexora.backend.dto;

import com.nexora.backend.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmployeeRequest {
    private String name;
    private Role role;
    private String department;
    private String position;
    private String avatar;
    private String status;
}
