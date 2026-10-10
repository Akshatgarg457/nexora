package com.nexora.backend.service;

import com.nexora.backend.dto.*;
import com.nexora.backend.entity.*;
import com.nexora.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ProgressReportRepository progressReportRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapProjectToDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return mapProjectToDto(project);
    }

    @Transactional
    public ProjectDto createProject(CreateProjectRequest request) {
        Employee manager = employeeRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager employee not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .status(request.getStatus())
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .endDate(request.getEndDate() != null ? request.getEndDate() : LocalDate.now().plusMonths(3))
                .manager(manager)
                .completionPercentage(request.getCompletionPercentage() != null ? request.getCompletionPercentage() : 0)
                .build();

        Project saved = projectRepository.save(project);
        return mapProjectToDto(saved);
    }

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::mapTaskToDto)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapTaskToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(CreateTaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Employee assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = employeeRepository.findById(request.getAssigneeId()).orElse(null);
        }

        ProjectTask task = ProjectTask.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .assignee(assignee)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusDays(7))
                .build();

        ProjectTask saved = taskRepository.save(task);
        return mapTaskToDto(saved);
    }

    @Transactional
    public TaskDto updateTaskStatus(Long taskId, TaskStatus status) {
        ProjectTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus(status);
        ProjectTask updated = taskRepository.save(task);

        // Auto recalculate project completion percentage
        recalculateProjectCompletion(updated.getProject().getId());

        return mapTaskToDto(updated);
    }

    public List<ProgressReportDto> getReportsByProject(Long projectId) {
        return progressReportRepository.findByProjectIdOrderByReportDateDesc(projectId).stream()
                .map(this::mapReportToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProgressReportDto createReport(CreateReportRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Employee author = employeeRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author employee not found"));

        ProgressReport report = ProgressReport.builder()
                .project(project)
                .author(author)
                .summary(request.getSummary())
                .reportDate(LocalDateTime.now())
                .progressPercentage(request.getProgressPercentage() != null ? request.getProgressPercentage() : project.getCompletionPercentage())
                .blockers(request.getBlockers())
                .build();

        if (request.getProgressPercentage() != null) {
            project.setCompletionPercentage(request.getProgressPercentage());
            projectRepository.save(project);
        }

        ProgressReport saved = progressReportRepository.save(report);
        return mapReportToDto(saved);
    }

    private void recalculateProjectCompletion(Long projectId) {
        List<ProjectTask> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) return;
        long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        int pct = (int) Math.round(((double) completed / tasks.size()) * 100);
        projectRepository.findById(projectId).ifPresent(p -> {
            p.setCompletionPercentage(pct);
            if (pct == 100) p.setStatus(ProjectStatus.COMPLETED);
            projectRepository.save(p);
        });
    }

    public ProjectDto mapProjectToDto(Project p) {
        if (p == null) return null;
        return ProjectDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .category(p.getCategory())
                .status(p.getStatus())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .manager(employeeService.mapToDto(p.getManager()))
                .completionPercentage(p.getCompletionPercentage())
                .build();
    }

    public TaskDto mapTaskToDto(ProjectTask t) {
        if (t == null) return null;
        boolean overdue = t.getDueDate() != null &&
                t.getDueDate().isBefore(LocalDate.now()) &&
                t.getStatus() != TaskStatus.DONE;

        return TaskDto.builder()
                .id(t.getId())
                .projectId(t.getProject().getId())
                .projectName(t.getProject().getName())
                .title(t.getTitle())
                .description(t.getDescription())
                .assignee(employeeService.mapToDto(t.getAssignee()))
                .status(t.getStatus())
                .priority(t.getPriority())
                .dueDate(t.getDueDate())
                .isOverdue(overdue)
                .build();
    }

    public ProgressReportDto mapReportToDto(ProgressReport r) {
        if (r == null) return null;
        return ProgressReportDto.builder()
                .id(r.getId())
                .projectId(r.getProject().getId())
                .projectName(r.getProject().getName())
                .author(employeeService.mapToDto(r.getAuthor()))
                .summary(r.getSummary())
                .reportDate(r.getReportDate())
                .progressPercentage(r.getProgressPercentage())
                .blockers(r.getBlockers())
                .build();
    }
}
