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
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final MeetingRepository meetingRepository;
    private final LearningResourceRepository resourceRepository;
    private final LearningProgressRepository progressRepository;

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

        List<Meeting> meetings = meetingRepository.findAll();
        long upcomingMeetings = meetings.stream()
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
        List<LearningProgress> progress = progressRepository.findAll();
        List<LearningProgress> completedProgress = progress.stream()
                .filter(p -> p.getStatus() == LearningStatus.COMPLETED)
                .filter(p -> p.getResource() != null && p.getResource().getCategory() != null)
                .toList();

        List<AnalyticsSummaryDto.CategoryMetric> categoryStats = resources.stream()
                .map(LearningResource::getCategory)
                .filter(Objects::nonNull)
                .distinct()
                .map(cat -> {
                    long total = resources.stream()
                            .filter(r -> cat.equalsIgnoreCase(r.getCategory()))
                            .count();
                    long completed = completedProgress.stream()
                            .filter(p -> cat.equalsIgnoreCase(p.getResource().getCategory()))
                            .count();
                    return new AnalyticsSummaryDto.CategoryMetric(cat, total, completed);
                })
                .toList();

        long activeLearners = progress.stream()
                .map(LearningProgress::getEmployee)
                .filter(Objects::nonNull)
                .map(Employee::getId)
                .filter(Objects::nonNull)
                .distinct()
                .count();

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
                .activeLearnersCount(activeLearners)
                .dataSourceNote(String.format(
                        "Computed from live database records at request time: %d employee(s), %d project(s), %d task(s), %d meeting(s), %d learning resource(s), %d learning progress record(s).",
                        totalEmployees, projects.size(), tasks.size(), meetings.size(), resources.size(), progress.size()))
                .projectStatusDistribution(projectStatusDist)
                .taskStatusDistribution(taskStatusDist)
                .learningCategoryStats(categoryStats)
                .build();
    }
}
