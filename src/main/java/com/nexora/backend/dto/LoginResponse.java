package com.nexora.backend.dto;

import com.nexora.backend.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresIn;
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String department;
    private String position;
    private String avatar;
}
