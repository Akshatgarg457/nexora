package com.nexora.backend.controller;

import com.nexora.backend.dto.*;
import com.nexora.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDto created = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(projectService.getAllTasks());
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskDto>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getTasksByProject(projectId));
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskDto created = projectService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskDto> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        TaskDto updated = projectService.updateTaskStatus(taskId, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{projectId}/reports")
    public ResponseEntity<List<ProgressReportDto>> getReportsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getReportsByProject(projectId));
    }

    @PostMapping("/reports")
    public ResponseEntity<ProgressReportDto> createReport(@Valid @RequestBody CreateReportRequest request) {
        ProgressReportDto created = projectService.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
