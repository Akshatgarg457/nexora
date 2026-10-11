package com.nexora.backend.service;

import com.nexora.backend.dto.LearningProgressDto;
import com.nexora.backend.dto.LearningResourceDto;
import com.nexora.backend.dto.UpdateProgressRequest;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.LearningProgress;
import com.nexora.backend.entity.LearningResource;
import com.nexora.backend.entity.LearningStatus;
import com.nexora.backend.repository.EmployeeRepository;
import com.nexora.backend.repository.LearningProgressRepository;
import com.nexora.backend.repository.LearningResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {

    // No generative AI provider is wired into this deployment. Synthesizing a summary from
    // fixed prose would present invented text as an analysis of the learner's own notes.
    private static final String AI_SUMMARY_UNAVAILABLE =
            "AI summary unavailable: no generative AI provider is configured for this Nexora deployment.";

    private final LearningResourceRepository resourceRepository;
    private final LearningProgressRepository progressRepository;
    private final EmployeeRepository employeeRepository;

    public List<LearningResourceDto> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::mapResourceToDto)
                .collect(Collectors.toList());
    }

    public List<LearningProgressDto> getEmployeeProgress(Long employeeId) {
        return progressRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapProgressToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearningProgressDto updateProgress(UpdateProgressRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        LearningResource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        LearningProgress progress = progressRepository
                .findByEmployeeIdAndResourceId(request.getEmployeeId(), request.getResourceId())
                .orElse(LearningProgress.builder()
                        .employee(employee)
                        .resource(resource)
                        .status(LearningStatus.NOT_STARTED)
                        .progressPercentage(0)
                        .build());

        if (request.getStatus() != null) {
            progress.setStatus(request.getStatus());
        }
        if (request.getProgressPercentage() != null) {
            progress.setProgressPercentage(request.getProgressPercentage());
            if (request.getProgressPercentage() >= 100) {
                progress.setStatus(LearningStatus.COMPLETED);
            } else if (request.getProgressPercentage() > 0) {
                progress.setStatus(LearningStatus.IN_PROGRESS);
            }
        }
        if (request.getVideoNotes() != null) {
            progress.setVideoNotes(request.getVideoNotes());
        }
        if (Boolean.TRUE.equals(request.getGenerateAiSummary())) {
            progress.setAiSummary(AI_SUMMARY_UNAVAILABLE);
        }

        progress.setLastAccessed(LocalDateTime.now());
        LearningProgress saved = progressRepository.save(progress);
        return mapProgressToDto(saved);
    }

    public LearningResourceDto mapResourceToDto(LearningResource res) {
        if (res == null) return null;
        return LearningResourceDto.builder()
                .id(res.getId())
                .title(res.getTitle())
                .category(res.getCategory())
                .description(res.getDescription())
                .resourceUrl(res.getResourceUrl())
                .estimatedTime(res.getEstimatedTime())
                .level(res.getLevel())
                .sampleTranscript(res.getSampleTranscript())
                .build();
    }

    public LearningProgressDto mapProgressToDto(LearningProgress lp) {
        if (lp == null) return null;
        return LearningProgressDto.builder()
                .id(lp.getId())
                .employeeId(lp.getEmployee().getId())
                .resource(mapResourceToDto(lp.getResource()))
                .status(lp.getStatus())
                .progressPercentage(lp.getProgressPercentage())
                .videoNotes(lp.getVideoNotes())
                .aiSummary(lp.getAiSummary())
                .lastAccessed(lp.getLastAccessed())
                .build();
    }
}
