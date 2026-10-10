package com.nexora.backend.config;

import com.nexora.backend.entity.*;
import com.nexora.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final MeetingRepository meetingRepository;
    private final MessageRepository messageRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final LearningProgressRepository learningProgressRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ProgressReportRepository progressReportRepository;
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

        // 1. Bootstrap Admin Initialization (Idempotent)
        Employee admin = initializeBootstrapAdmin();

        // 2. Seed Sample Demo Company Employees if table is small
        if (employeeRepository.count() <= 1) {
            seedDemoData(admin);
        }
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

    private void seedDemoData(Employee admin) {
        log.info("Nexora Seeding: Initializing sample workspace data...");

        // Employees
        Employee manager = Employee.builder()
                .name("Alex Morgan")
                .email("alex.morgan@nexora.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.MANAGER)
                .department("Engineering")
                .position("Engineering Lead")
                .avatar("AM")
                .status("Online")
                .active(true)
                .build();

        Employee employee = Employee.builder()
                .name("Sarah Chen")
                .email("sarah.chen@nexora.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.EMPLOYEE)
                .department("Product Design")
                .position("Senior UI/UX Specialist")
                .avatar("SC")
                .status("Away")
                .active(true)
                .build();

        Employee intern = Employee.builder()
                .name("David Vance")
                .email("david.vance@nexora.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.INTERN)
                .department("Engineering")
                .position("AI Research Intern")
                .avatar("DV")
                .status("Online")
                .active(true)
                .build();

        employeeRepository.saveAll(List.of(manager, employee, intern));

        // Projects
        Project project1 = Project.builder()
                .name("Cloud Infrastructure Migration")
                .description("Next-gen cloud migration and multi-region microservice infrastructure for Nexora Workspace.")
                .category("Cloud Computing")
                .status(ProjectStatus.IN_PROGRESS)
                .startDate(LocalDate.now().minusDays(15))
                .endDate(LocalDate.now().plusDays(45))
                .manager(manager)
                .completionPercentage(65)
                .build();

        Project project2 = Project.builder()
                .name("Nexora Autonomous AI Assistant")
                .description("LLM agent orchestrator for enterprise natural language operations and smart scheduling.")
                .category("AI & Data Science")
                .status(ProjectStatus.IN_PROGRESS)
                .startDate(LocalDate.now().minusDays(30))
                .endDate(LocalDate.now().plusDays(30))
                .manager(admin)
                .completionPercentage(80)
                .build();

        Project project3 = Project.builder()
                .name("Zero-Trust Security Audit")
                .description("Comprehensive security assessment, OAuth2/JWT hardening, and RBAC policy enforcement.")
                .category("Cybersecurity")
                .status(ProjectStatus.PLANNING)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(60))
                .manager(manager)
                .completionPercentage(20)
                .build();

        projectRepository.saveAll(List.of(project1, project2, project3));

        // Tasks
        ProjectTask task1 = ProjectTask.builder()
                .project(project1)
                .title("Configure Spring Security JWT Filter & Authorities")
                .description("Ensure stateful sessions are stateless and token validation uses HMAC SHA-256 key.")
                .assignee(manager)
                .status(TaskStatus.DONE)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().minusDays(1))
                .build();

        ProjectTask task2 = ProjectTask.builder()
                .project(project2)
                .title("Train Gemini Intent Classification for Adaptive Workspace")
                .description("Integrate natural language workspace reordering for user prompts.")
                .assignee(intern)
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.URGENT)
                .dueDate(LocalDate.now().plusDays(2))
                .build();

        ProjectTask task3 = ProjectTask.builder()
                .project(project1)
                .title("MySQL Database Migration & Index Optimization")
                .description("Apply JPA ddl-auto updates and set up environment variables for DB credentials.")
                .assignee(employee)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .dueDate(LocalDate.now().minusDays(3)) // Overdue task for demo
                .build();

        taskRepository.saveAll(List.of(task1, task2, task3));

        // Progress Reports
        ProgressReport report1 = ProgressReport.builder()
                .project(project1)
                .author(manager)
                .summary("Successfully finalized Spring Security integration and connected MySQL database layer.")
                .reportDate(LocalDateTime.now().minusDays(2))
                .progressPercentage(65)
                .blockers("None currently.")
                .build();

        progressReportRepository.save(report1);

        // Meetings
        Meeting meeting1 = Meeting.builder()
                .title("Enterprise Architecture Review & Sprint Planning")
                .description("Review weekly milestone progress, security guidelines, and workspace layout personalization.")
                .date(LocalDate.now().plusDays(1))
                .time(LocalTime.of(10, 0))
                .location("Executive Conference Room A")
                .organizer(admin)
                .participants(Set.of(manager, employee, intern))
                .agenda("1. Sprint Demo\n2. Security RBAC Audit\n3. AI Assistant Integration")
                .notes("All team leads should prepare status reports prior to the sync.")
                .status("UPCOMING")
                .build();

        Meeting meeting2 = Meeting.builder()
                .title("AI Agents Learning & Study Circle")
                .description("Interactive study session on Spring Boot 3 + AI Agent integration.")
                .date(LocalDate.now().plusDays(3))
                .time(LocalTime.of(14, 30))
                .location("Virtual Workspace Room 2")
                .organizer(manager)
                .participants(Set.of(employee, intern))
                .agenda("1. Autonomous Agents Overview\n2. Hands-on Code Walkthrough")
                .notes("Read Study Workspace material before joining.")
                .status("UPCOMING")
                .build();

        meetingRepository.saveAll(List.of(meeting1, meeting2));

        // Messages
        Message msg1 = Message.builder()
                .sender(manager)
                .receiver(admin)
                .content("Hello Admin, the database migration and JWT authorization setup is complete!")
                .timestamp(LocalDateTime.now().minusHours(2))
                .isRead(true)
                .build();

        Message msg2 = Message.builder()
                .sender(admin)
                .receiver(manager)
                .content("Excellent work Alex! Please review the latest project tasks and employee directory.")
                .timestamp(LocalDateTime.now().minusHours(1))
                .isRead(true)
                .build();

        messageRepository.saveAll(List.of(msg1, msg2));

        // Learning Resources
        LearningResource res1 = LearningResource.builder()
                .title("Mastering Autonomous AI Agents in Enterprise")
                .category("AI Agents")
                .description("Comprehensive guide to building tool-using, multi-step LLM agents for workspace automation.")
                .resourceUrl("https://nexora.com/learn/ai-agents")
                .estimatedTime("3 Hours")
                .level("Intermediate")
                .sampleTranscript("Welcome to autonomous AI agents. Today we discuss tool execution, state memory, multi-agent collaboration, and strict security isolation.")
                .build();

        LearningResource res2 = LearningResource.builder()
                .title("Spring Boot 3 Security & JWT Deep Dive")
                .category("Spring Boot")
                .description("Learn stateless authentication, BCrypt password hashing, custom filters, and RBAC authorization.")
                .resourceUrl("https://nexora.com/learn/spring-security")
                .estimatedTime("4 Hours")
                .level("Advanced")
                .sampleTranscript("In this lecture, we build a stateless JWT SecurityFilterChain in Spring Boot 3 with MySQL persistence and role-based endpoints.")
                .build();

        LearningResource res3 = LearningResource.builder()
                .title("Cloud Native Data Analytics with MySQL & Recharts")
                .category("Data Analytics")
                .description("Visualizing corporate KPIs, project velocity, and completion metrics with modern web charts.")
                .resourceUrl("https://nexora.com/learn/data-analytics")
                .estimatedTime("2 Hours")
                .level("Beginner")
                .sampleTranscript("Data visualization allows teams to monitor health metrics in real time. We explore bar charts, pie charts, and KPI summary indicators.")
                .build();

        learningResourceRepository.saveAll(List.of(res1, res2, res3));

        // Learning Progress
        LearningProgress prog1 = LearningProgress.builder()
                .employee(intern)
                .resource(res1)
                .status(LearningStatus.IN_PROGRESS)
                .progressPercentage(45)
                .videoNotes("Learned about LLM tool declarations and JSON schema parsing.")
                .aiSummary("[Nexora AI Summary]: Mastered autonomous agent execution flow and tool invocation boundaries.")
                .lastAccessed(LocalDateTime.now())
                .build();

        learningProgressRepository.save(prog1);

        log.info("Nexora Demo Data Seeding Completed Successfully!");
    }
}
