package com.nexora.backend.service;

import com.nexora.backend.dto.CreateEmployeeRequest;
import com.nexora.backend.dto.EmployeeDto;
import com.nexora.backend.dto.UpdateEmployeeRequest;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Role;
import com.nexora.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminEmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeService employeeService;

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeService::mapToDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return employeeService.mapToDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(CreateEmployeeRequest request) {
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Employee with email '" + request.getEmail() + "' already exists");
        }

        String rawPassword = request.getPassword();
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = "NexoraTempPass" + UUID.randomUUID().toString().substring(0, 6) + "!";
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);

        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(hashedPassword)
                .role(request.getRole() != null ? request.getRole() : Role.EMPLOYEE)
                .department(request.getDepartment() != null ? request.getDepartment() : "General Work")
                .position(request.getPosition() != null ? request.getPosition() : "Team Member")
                .avatar(request.getAvatar() != null ? request.getAvatar() : "🌸")
                .status("Online")
                .active(true)
                .build();

        Employee saved = employeeRepository.save(employee);
        return employeeService.mapToDto(saved);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, UpdateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            employee.setName(request.getName());
        }
        if (request.getRole() != null) {
            employee.setRole(request.getRole());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getPosition() != null) {
            employee.setPosition(request.getPosition());
        }
        if (request.getAvatar() != null) {
            employee.setAvatar(request.getAvatar());
        }
        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }

        Employee updated = employeeRepository.save(employee);
        return employeeService.mapToDto(updated);
    }

    @Transactional
    public EmployeeDto updateEmployeeStatus(Long id, boolean active) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setActive(active);
        Employee updated = employeeRepository.save(employee);
        return employeeService.mapToDto(updated);
    }
}
