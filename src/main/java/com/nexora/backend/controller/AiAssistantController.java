package com.nexora.backend.controller;

import com.nexora.backend.dto.AiRequestDto;
import com.nexora.backend.dto.AiResponseDto;
import com.nexora.backend.service.AiAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/query")
    public ResponseEntity<AiResponseDto> queryAiAssistant(@RequestBody AiRequestDto request) {
        return ResponseEntity.ok(aiAssistantService.processPrompt(request));
    }
}
