package com.nexora.backend;

import com.nexora.backend.dto.CreateEmployeeRequest;
import com.nexora.backend.dto.EmployeeDto;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Role;
import com.nexora.backend.repository.EmployeeRepository;
import com.nexora.backend.service.AdminEmployeeService;
import com.nexora.backend.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AdminEmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private AdminEmployeeService adminEmployeeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateEmployeeSuccess() {
        CreateEmployeeRequest request = CreateEmployeeRequest.builder()
                .name("New Staff")
                .email("staff@nexora.com")
                .password("Password123!")
                .role(Role.EMPLOYEE)
                .department("Engineering")
                .position("Developer")
                .build();

        Employee savedEntity = Employee.builder()
                .id(2L)
                .name("New Staff")
                .email("staff@nexora.com")
                .password("$2a$10$encoded")
                .role(Role.EMPLOYEE)
                .active(true)
                .build();

        EmployeeDto expectedDto = EmployeeDto.builder()
                .id(2L)
                .name("New Staff")
                .email("staff@nexora.com")
                .role(Role.EMPLOYEE)
                .active(true)
                .build();

        when(employeeRepository.findByEmail("staff@nexora.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Password123!")).thenReturn("$2a$10$encoded");
        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEntity);
        when(employeeService.mapToDto(savedEntity)).thenReturn(expectedDto);

        EmployeeDto result = adminEmployeeService.createEmployee(request);

        assertNotNull(result);
        assertEquals("staff@nexora.com", result.getEmail());
        assertEquals(Role.EMPLOYEE, result.getRole());
    }

    @Test
    void testCreateEmployeeDuplicateEmailRejection() {
        CreateEmployeeRequest request = CreateEmployeeRequest.builder()
                .name("Duplicate Staff")
                .email("existing@nexora.com")
                .role(Role.EMPLOYEE)
                .build();

        Employee existing = Employee.builder().id(10L).email("existing@nexora.com").build();
        when(employeeRepository.findByEmail("existing@nexora.com")).thenReturn(Optional.of(existing));

        Exception exception = assertThrows(RuntimeException.class, () -> adminEmployeeService.createEmployee(request));
        assertTrue(exception.getMessage().contains("already exists"));
    }
}
