package com.nexora.backend.service;

import com.nexora.backend.dto.EmployeeDto;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return mapToDto(employee);
    }

    public EmployeeDto mapToDto(Employee employee) {
        if (employee == null) return null;
        return EmployeeDto.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .avatar(employee.getAvatar())
                .role(employee.getRole())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .status(employee.getStatus())
                .active(employee.isActive())
                .build();
    }
}
