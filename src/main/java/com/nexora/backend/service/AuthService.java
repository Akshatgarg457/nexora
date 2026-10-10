package com.nexora.backend.service;

import com.nexora.backend.dto.EmployeeDto;
import com.nexora.backend.dto.LoginRequest;
import com.nexora.backend.dto.LoginResponse;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.repository.EmployeeRepository;
import com.nexora.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmployeeService employeeService;

    public LoginResponse login(LoginRequest request) {
        // Generic error message to not reveal account existence
        String errorMessage = "Invalid email address or password";

        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(errorMessage));

        if (!employee.isActive()) {
            throw new RuntimeException("Account is disabled. Please contact your Nexora administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new RuntimeException(errorMessage);
        }

        String token = tokenProvider.generateToken(employee.getId(), employee.getEmail(), employee.getRole().name());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(employee.getRole())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .avatar(employee.getAvatar())
                .build();
    }

    public EmployeeDto getCurrentUser(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return employeeService.mapToDto(employee);
    }
}
