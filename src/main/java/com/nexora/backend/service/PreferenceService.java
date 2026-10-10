package com.nexora.backend.service;

import com.nexora.backend.dto.CustomizeWorkspaceRequest;
import com.nexora.backend.dto.PreferenceDto;
import com.nexora.backend.entity.WorkspacePreference;
import com.nexora.backend.repository.PreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;

    public PreferenceDto getPreference(Long employeeId) {
        WorkspacePreference pref = preferenceRepository.findByEmployeeId(employeeId)
                .orElse(WorkspacePreference.builder()
                        .employeeId(employeeId)
                        .customPrompt("Default workspace view")
                        .prioritizedWorkspaces("MEETINGS,COMMUNICATION,STUDY,PROJECTS,ANALYTICS")
                        .explanationText("Your workspace is displayed with standard company layout.")
                        .build());

        return mapToDto(pref);
    }

    @Transactional
    public PreferenceDto customizeWorkspace(CustomizeWorkspaceRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().toLowerCase(Locale.ROOT) : "";
        Long employeeId = request.getEmployeeId() != null ? request.getEmployeeId() : 1L;

        List<String> order = new ArrayList<>();
        List<String> highlightedGoals = new ArrayList<>();

        if (prompt.contains("project") || prompt.contains("task") || prompt.contains("manage")) {
            order.add("PROJECTS");
            highlightedGoals.add("project tracking");
        }
        if (prompt.contains("learn") || prompt.contains("study") || prompt.contains("tech") || prompt.contains("ai")) {
            order.add("STUDY");
            highlightedGoals.add("technology learning");
        }
        if (prompt.contains("meet") || prompt.contains("schedule") || prompt.contains("calendar")) {
            order.add("MEETINGS");
            highlightedGoals.add("meeting schedules");
        }
        if (prompt.contains("chat") || prompt.contains("message") || prompt.contains("comm")) {
            order.add("COMMUNICATION");
            highlightedGoals.add("direct communication");
        }
        if (prompt.contains("data") || prompt.contains("metric") || prompt.contains("analytic") || prompt.contains("kpi")) {
            order.add("ANALYTICS");
            highlightedGoals.add("business analytics");
        }

        // Fill remaining workspaces
        List<String> defaultOrder = List.of("MEETINGS", "COMMUNICATION", "STUDY", "PROJECTS", "ANALYTICS");
        for (String w : defaultOrder) {
            if (!order.contains(w)) {
                order.add(w);
            }
        }

        String explanation;
        if (!highlightedGoals.isEmpty()) {
            explanation = "Your workspace prioritizes " + String.join(" and ", highlightedGoals) + " based on your selected goals.";
        } else {
            explanation = "Your workspace layout has been customized to match your input preferences.";
        }

        WorkspacePreference pref = preferenceRepository.findByEmployeeId(employeeId)
                .orElse(WorkspacePreference.builder().employeeId(employeeId).build());

        pref.setCustomPrompt(request.getPrompt());
        pref.setPrioritizedWorkspaces(String.join(",", order));
        pref.setExplanationText(explanation);

        WorkspacePreference saved = preferenceRepository.save(pref);
        return mapToDto(saved);
    }

    private PreferenceDto mapToDto(WorkspacePreference pref) {
        List<String> list = pref.getPrioritizedWorkspaces() != null
                ? Arrays.asList(pref.getPrioritizedWorkspaces().split(","))
                : List.of("MEETINGS", "COMMUNICATION", "STUDY", "PROJECTS", "ANALYTICS");

        return PreferenceDto.builder()
                .id(pref.getId())
                .employeeId(pref.getEmployeeId())
                .customPrompt(pref.getCustomPrompt())
                .prioritizedWorkspaces(list)
                .explanationText(pref.getExplanationText())
                .build();
    }
}
