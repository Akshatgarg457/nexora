package com.nexora.backend.service;

import com.nexora.backend.dto.AnalyticsSummaryDto;
import com.nexora.backend.entity.*;
import com.nexora.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final MeetingRepository meetingRepository;
    private final LearningResourceRepository resourceRepository;

    public AnalyticsSummaryDto getAnalyticsSummary() {
        long totalEmployees = employeeRepository.count();

        List<Project> projects = projectRepository.findAll();
        long activeProjects = projects.stream().filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS).count();
        long completedProjects = projects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count();

        double avgCompletion = projects.isEmpty() ? 0.0 : projects.stream()
                .mapToInt(p -> p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0)
                .average().orElse(0.0);

        List<ProjectTask> tasks = taskRepository.findAll();
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long overdueTasks = tasks.stream().filter(t -> t.getDueDate() != null &&
                t.getDueDate().isBefore(LocalDate.now()) &&
                t.getStatus() != TaskStatus.DONE).count();

        double taskCompletionRate = totalTasks > 0 ? Math.round(((double) completedTasks / totalTasks) * 1000.0) / 10.0 : 0.0;

        long upcomingMeetings = meetingRepository.findAll().stream()
                .filter(m -> "UPCOMING".equalsIgnoreCase(m.getStatus()))
                .count();

        Map<String, Long> projectStatusDist = new HashMap<>();
        for (ProjectStatus status : ProjectStatus.values()) {
            long count = projects.stream().filter(p -> p.getStatus() == status).count();
            projectStatusDist.put(status.name(), count);
        }

        Map<String, Long> taskStatusDist = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            long count = tasks.stream().filter(t -> t.getStatus() == status).count();
            taskStatusDist.put(status.name(), count);
        }

        List<LearningResource> resources = resourceRepository.findAll();
        List<AnalyticsSummaryDto.CategoryMetric> categoryStats = resources.stream()
                .map(r -> r.getCategory())
                .distinct()
                .map(cat -> {
                    long total = resources.stream().filter(r -> r.getCategory().equalsIgnoreCase(cat)).count();
                    return new AnalyticsSummaryDto.CategoryMetric(cat, total, total > 0 ? 1 : 0);
                })
                .toList();

        return AnalyticsSummaryDto.builder()
                .totalEmployees(totalEmployees)
                .activeProjectsCount(activeProjects)
                .completedProjectsCount(completedProjects)
                .totalTasksCount(totalTasks)
                .completedTasksCount(completedTasks)
                .overdueTasksCount(overdueTasks)
                .taskCompletionRate(taskCompletionRate)
                .upcomingMeetingsCount(upcomingMeetings)
                .avgProjectCompletion(Math.round(avgCompletion * 10.0) / 10.0)
                .activeLearnersCount(totalEmployees)
                .dataSourceNote("Calculated dynamically from live Nexora workspace database records.")
                .projectStatusDistribution(projectStatusDist)
                .taskStatusDistribution(taskStatusDist)
                .learningCategoryStats(categoryStats)
                .build();
    }
}
