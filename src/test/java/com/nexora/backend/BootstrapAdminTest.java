package com.nexora.backend;

import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Role;
import com.nexora.backend.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BootstrapAdminTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void testBootstrapAdminCreated() {
        Optional<Employee> adminOpt = employeeRepository.findByEmail("admin@nexora.com");
        assertTrue(adminOpt.isPresent(), "Bootstrap admin account should be created on application launch");

        Employee admin = adminOpt.get();
        assertEquals(Role.ADMIN, admin.getRole());
        assertEquals("Nexora System Admin", admin.getName());
        assertTrue(admin.isActive());
        assertNotEquals("Admin@Nexora2026!", admin.getPassword(), "Password must be hashed with BCrypt");
    }
}
