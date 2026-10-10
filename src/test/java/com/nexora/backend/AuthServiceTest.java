package com.nexora.backend;

import com.nexora.backend.dto.LoginRequest;
import com.nexora.backend.dto.LoginResponse;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Role;
import com.nexora.backend.repository.EmployeeRepository;
import com.nexora.backend.security.JwtTokenProvider;
import com.nexora.backend.service.AuthService;
import com.nexora.backend.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private AuthService authService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testEmployee = Employee.builder()
                .id(1L)
                .name("Test User")
                .email("test@nexora.com")
                .password("$2a$10$hashedPassword")
                .role(Role.EMPLOYEE)
                .active(true)
                .build();
    }

    @Test
    void testValidLogin() {
        LoginRequest request = new LoginRequest("test@nexora.com", "Password123!");

        when(employeeRepository.findByEmail("test@nexora.com")).thenReturn(Optional.of(testEmployee));
        when(passwordEncoder.matches("Password123!", "$2a$10$hashedPassword")).thenReturn(true);
        when(tokenProvider.generateToken(1L, "test@nexora.com", "EMPLOYEE")).thenReturn("mock-jwt-token");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getAccessToken());
        assertEquals("test@nexora.com", response.getEmail());
        assertEquals(Role.EMPLOYEE, response.getRole());
    }

    @Test
    void testInvalidPasswordLogin() {
        LoginRequest request = new LoginRequest("test@nexora.com", "WrongPassword");

        when(employeeRepository.findByEmail("test@nexora.com")).thenReturn(Optional.of(testEmployee));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertTrue(exception.getMessage().contains("Invalid email address or password"));
    }

    @Test
    void testDisabledAccountLogin() {
        testEmployee.setActive(false);
        LoginRequest request = new LoginRequest("test@nexora.com", "Password123!");

        when(employeeRepository.findByEmail("test@nexora.com")).thenReturn(Optional.of(testEmployee));

        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertTrue(exception.getMessage().contains("Account is disabled"));
    }
}
