package com.nexora.backend.controller;

import com.nexora.backend.dto.LearningProgressDto;
import com.nexora.backend.dto.LearningResourceDto;
import com.nexora.backend.dto.UpdateProgressRequest;
import com.nexora.backend.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudyController {

    private final StudyService studyService;

    @GetMapping("/resources")
    public ResponseEntity<List<LearningResourceDto>> getAllResources() {
        return ResponseEntity.ok(studyService.getAllResources());
    }

    @GetMapping("/progress/{employeeId}")
    public ResponseEntity<List<LearningProgressDto>> getEmployeeProgress(@PathVariable Long employeeId) {
        return ResponseEntity.ok(studyService.getEmployeeProgress(employeeId));
    }

    @PostMapping("/progress")
    public ResponseEntity<LearningProgressDto> updateProgress(@RequestBody UpdateProgressRequest request) {
        LearningProgressDto updated = studyService.updateProgress(request);
        return ResponseEntity.ok(updated);
    }
}
