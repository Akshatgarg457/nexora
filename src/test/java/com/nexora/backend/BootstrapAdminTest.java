package com.nexora.backend;

import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Role;
import com.nexora.backend.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
// @ActiveProfiles alone cannot stop an exported NEXORA_BOOTSTRAP_ENABLED=false
// from overriding application-test.properties, because OS environment variables
// outrank profile-specific classpath properties. @TestPropertySource is added
// above the environment, which pins the fixtures this test asserts against.
@TestPropertySource(locations = "classpath:application-test.properties")
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
