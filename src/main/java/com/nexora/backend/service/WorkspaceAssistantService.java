package com.nexora.backend.service;

import com.nexora.backend.dto.AiRequestDto;
import com.nexora.backend.dto.AiResponseDto;
import com.nexora.backend.entity.LearningResource;
import com.nexora.backend.entity.Meeting;
import com.nexora.backend.entity.Project;
import com.nexora.backend.entity.ProjectStatus;
import com.nexora.backend.entity.ProjectTask;
import com.nexora.backend.entity.TaskStatus;
import com.nexora.backend.repository.LearningResourceRepository;
import com.nexora.backend.repository.MeetingRepository;
import com.nexora.backend.repository.ProjectRepository;
import com.nexora.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Answers a fixed set of workspace lookups by querying the database directly.
 * There is no generative AI provider behind this service: anything outside the
 * supported lookups is reported as unsupported rather than answered with invented content.
 */
@Service
@RequiredArgsConstructor
public class WorkspaceAssistantService implements AiAssistantService {

    private static final String SOURCE =
            "Nexora workspace query engine (deterministic lookups computed from database records)";

    private static final String UNSUPPORTED =
            "No generative AI provider is configured for this Nexora deployment, so free-form questions "
            + "cannot be answered. Supported lookups, each computed from workspace records: upcoming meetings, "
            + "overdue tasks, project status, learning resources, and task completion metrics.";

    private static final List<String> SUGGESTED_ACTIONS = List.of(
            "Show my upcoming meetings",
            "List overdue project tasks",
            "Summarize project status",
            "Show available learning resources",
            "Show task completion metrics"
    );

    private final MeetingRepository meetingRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final LearningResourceRepository learningResourceRepository;

    @Override
    public AiResponseDto processPrompt(AiRequestDto request) {
        String prompt = request.getPrompt() == null ? "" : request.getPrompt().toLowerCase(Locale.ROOT);

        if (prompt.contains("meeting")) {
            return answer(upcomingMeetings(), "MEETINGS");
        }
        if (prompt.contains("overdue") || prompt.contains("task")) {
            return answer(overdueTasks(), "PROJECTS");
        }
        if (prompt.contains("learn") || prompt.contains("agent") || prompt.contains("study")) {
            return answer(learningResources(), "STUDY");
        }
        if (prompt.contains("status") || prompt.contains("project")) {
            return answer(projectStatus(), "PROJECTS");
        }
        if (prompt.contains("metric") || prompt.contains("analytics") || prompt.contains("kpi")) {
            return answer(taskMetrics(), "ANALYTICS");
        }
        return answer(UNSUPPORTED, null);
    }

    private String upcomingMeetings() {
        List<Meeting> upcoming = meetingRepository.findAll().stream()
                .filter(meeting -> "UPCOMING".equalsIgnoreCase(meeting.getStatus()))
                .sorted(Comparator.comparing(Meeting::getDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();

        if (upcoming.isEmpty()) {
            return "There are no meetings with status UPCOMING in the workspace.";
        }

        Meeting next = upcoming.get(0);
        return String.format("%d upcoming meeting(s). Next: '%s' on %s at %s in %s. Agenda: %s",
                upcoming.size(), next.getTitle(), next.getDate(), next.getTime(), next.getLocation(),
                next.getAgenda() != null ? next.getAgenda() : "not set");
    }

    private String overdueTasks() {
        LocalDate today = LocalDate.now();
        List<ProjectTask> overdue = taskRepository.findAll().stream()
                .filter(task -> task.getDueDate() != null
                        && task.getDueDate().isBefore(today)
                        && task.getStatus() != TaskStatus.DONE)
                .sorted(Comparator.comparing(ProjectTask::getDueDate))
                .toList();

        if (overdue.isEmpty()) {
            return "There are no overdue tasks in the workspace.";
        }

        ProjectTask oldest = overdue.get(0);
        return String.format("%d overdue task(s). Most overdue: '%s' (due %s, status %s, priority %s, assignee %s).",
                overdue.size(), oldest.getTitle(), oldest.getDueDate(), oldest.getStatus(), oldest.getPriority(),
                oldest.getAssignee() != null ? oldest.getAssignee().getName() : "unassigned");
    }

    private String learningResources() {
        List<LearningResource> resources = learningResourceRepository.findAll();
        if (resources.isEmpty()) {
            return "There are no learning resources in the workspace.";
        }

        String listing = resources.stream()
                .map(resource -> String.format("'%s' [%s, %s, %s]",
                        resource.getTitle(), resource.getCategory(), resource.getLevel(), resource.getEstimatedTime()))
                .collect(Collectors.joining("; "));

        return String.format("%d learning resource(s) available: %s", resources.size(), listing);
    }

    private String projectStatus() {
        List<Project> projects = projectRepository.findAll();
        if (projects.isEmpty()) {
            return "There are no projects in the workspace.";
        }

        long inProgress = projects.stream().filter(project -> project.getStatus() == ProjectStatus.IN_PROGRESS).count();
        Project highest = projects.stream()
                .max(Comparator.comparingInt(this::completionOf))
                .orElseThrow();

        return String.format("%d project(s) in the workspace, %d currently IN_PROGRESS. Highest completion: '%s' at %d%% (%s).",
                projects.size(), inProgress, highest.getName(), completionOf(highest), highest.getStatus());
    }

    private String taskMetrics() {
        List<ProjectTask> tasks = taskRepository.findAll();
        if (tasks.isEmpty()) {
            return "There are no tasks in the workspace, so no completion metric can be calculated.";
        }

        long done = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        double rate = ((double) done / tasks.size()) * 100.0;

        return String.format("Task completion: %d of %d task(s) DONE (%.1f%%).", done, tasks.size(), rate);
    }

    private int completionOf(Project project) {
        return project.getCompletionPercentage() != null ? project.getCompletionPercentage() : 0;
    }

    private AiResponseDto answer(String response, String targetWorkspace) {
        return AiResponseDto.builder()
                .response(response)
                .source(SOURCE)
                .targetWorkspace(targetWorkspace)
                .suggestedActions(SUGGESTED_ACTIONS)
                .isSimulated(true)
                .build();
    }
}
