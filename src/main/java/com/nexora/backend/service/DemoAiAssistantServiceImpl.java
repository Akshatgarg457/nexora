package com.nexora.backend.service;

import com.nexora.backend.dto.AiRequestDto;
import com.nexora.backend.dto.AiResponseDto;
import com.nexora.backend.entity.Meeting;
import com.nexora.backend.entity.Project;
import com.nexora.backend.entity.ProjectTask;
import com.nexora.backend.repository.MeetingRepository;
import com.nexora.backend.repository.ProjectRepository;
import com.nexora.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DemoAiAssistantServiceImpl implements AiAssistantService {

    private final MeetingRepository meetingRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    public AiResponseDto processPrompt(AiRequestDto request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().toLowerCase(Locale.ROOT) : "";
        String responseText;
        String targetWorkspace = null;
        List<String> suggestions = List.of(
            "Prepare me for my next meeting.",
            "Show overdue project tasks.",
            "Help me learn AI agents.",
            "Summarize the latest project status.",
            "Show our project completion metrics."
        );

        if (prompt.contains("meeting")) {
            List<Meeting> meetings = meetingRepository.findAll().stream()
                    .filter(m -> "UPCOMING".equalsIgnoreCase(m.getStatus()))
                    .toList();
            if (!meetings.isEmpty()) {
                Meeting next = meetings.get(0);
                responseText = String.format("[Nexora AI]: Your upcoming meeting is '%s' on %s at %s in %s. Agenda: %s",
                        next.getTitle(), next.getDate(), next.getTime(), next.getLocation(),
                        next.getAgenda() != null ? next.getAgenda() : "General Sync");
            } else {
                responseText = "[Nexora AI]: You have no upcoming meetings scheduled today. Enjoy your focused work time!";
            }
            targetWorkspace = "MEETINGS";

        } else if (prompt.contains("overdue") || prompt.contains("task")) {
            List<ProjectTask> overdue = taskRepository.findAll().stream()
                    .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != com.nexora.backend.entity.TaskStatus.DONE)
                    .toList();
            if (!overdue.isEmpty()) {
                responseText = String.format("[Nexora AI]: Found %d overdue tasks. Highest priority: '%s' (Due: %s, Assignee: %s).",
                        overdue.size(), overdue.get(0).getTitle(), overdue.get(0).getDueDate(),
                        overdue.get(0).getAssignee() != null ? overdue.get(0).getAssignee().getName() : "Unassigned");
            } else {
                responseText = "[Nexora AI]: Great news! There are currently zero overdue project tasks across all active projects.";
            }
            targetWorkspace = "PROJECTS";

        } else if (prompt.contains("learn") || prompt.contains("agent") || prompt.contains("study")) {
            responseText = "[Nexora AI]: Recommended learning path: 'Mastering Autonomous AI Agents in Enterprise'. Estimated time: 3 hours. Topic covers LLM orchestration, Spring Security boundaries, and RAG execution.";
            targetWorkspace = "STUDY";

        } else if (prompt.contains("status") || prompt.contains("project")) {
            List<Project> projects = projectRepository.findAll();
            long active = projects.stream().filter(p -> p.getStatus() == com.nexora.backend.entity.ProjectStatus.IN_PROGRESS).count();
            responseText = String.format("[Nexora AI]: Nexora has %d total projects (%d actively in progress). Top priority: 'Cloud Infrastructure Migration' (65%% completed).",
                    projects.size(), active);
            targetWorkspace = "PROJECTS";

        } else if (prompt.contains("metric") || prompt.contains("analytics") || prompt.contains("kpi")) {
            List<ProjectTask> tasks = taskRepository.findAll();
            long done = tasks.stream().filter(t -> t.getStatus() == com.nexora.backend.entity.TaskStatus.DONE).count();
            double rate = tasks.isEmpty() ? 0.0 : ((double) done / tasks.size()) * 100.0;
            responseText = String.format("[Nexora AI]: Current Workspace Completion Metric: %.1f%% task completion rate across %d total tasks.",
                    rate, tasks.size());
            targetWorkspace = "ANALYTICS";

        } else {
            responseText = String.format("[Nexora AI]: I received your prompt: '%s'. I can help you inspect meetings, monitor overdue tasks, explore technology learning paths, summarize project status, or view team analytics.", request.getPrompt());
        }

        return AiResponseDto.builder()
                .response(responseText)
                .source("Nexora AI Assistant (Enterprise Service)")
                .targetWorkspace(targetWorkspace)
                .suggestedActions(suggestions)
                .isSimulated(true)
                .build();
    }
}
