package com.nexora.backend.config;

import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Role;
import com.nexora.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${nexora.bootstrap.admin.email:admin@nexora.com}")
    private String bootstrapAdminEmail;

    @Value("${nexora.bootstrap.admin.password:Admin@Nexora2026!}")
    private String bootstrapAdminPassword;

    @Value("${nexora.bootstrap.admin.name:Nexora System Admin}")
    private String bootstrapAdminName;

    @Value("${nexora.bootstrap.enabled:true}")
    private boolean bootstrapEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!bootstrapEnabled) {
            log.info("Bootstrap admin initialization is disabled via configuration.");
            return;
        }

        initializeBootstrapAdmin();
    }

    private Employee initializeBootstrapAdmin() {
        return employeeRepository.findByEmail(bootstrapAdminEmail)
                .map(existingAdmin -> {
                    log.info("Nexora Bootstrap: Admin account '{}' already exists. Skipping initialization.", bootstrapAdminEmail);
                    return existingAdmin;
                })
                .orElseGet(() -> {
                    log.info("Nexora Bootstrap: Creating initial admin account '{}'", bootstrapAdminEmail);
                    Employee newAdmin = Employee.builder()
                            .name(bootstrapAdminName)
                            .email(bootstrapAdminEmail)
                            .password(passwordEncoder.encode(bootstrapAdminPassword))
                            .role(Role.ADMIN)
                            .department("Executive Office")
                            .position("Chief Technology Administrator")
                            .avatar("NA")
                            .status("Online")
                            .active(true)
                            .build();

                    Employee saved = employeeRepository.save(newAdmin);
                    log.info("Bootstrap Admin successfully initialized with ID: {}", saved.getId());
                    return saved;
                });
    }
}
