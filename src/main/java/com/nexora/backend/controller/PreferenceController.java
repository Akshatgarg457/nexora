package com.nexora.backend.controller;

import com.nexora.backend.dto.CustomizeWorkspaceRequest;
import com.nexora.backend.dto.PreferenceDto;
import com.nexora.backend.service.PreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PreferenceController {

    private final PreferenceService preferenceService;

    @GetMapping("/{employeeId}")
    public ResponseEntity<PreferenceDto> getPreference(@PathVariable Long employeeId) {
        return ResponseEntity.ok(preferenceService.getPreference(employeeId));
    }

    @PostMapping("/customize")
    public ResponseEntity<PreferenceDto> customizeWorkspace(@Valid @RequestBody CustomizeWorkspaceRequest request) {
        return ResponseEntity.ok(preferenceService.customizeWorkspace(request));
    }
}
