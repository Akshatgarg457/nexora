package com.nexora.backend.service;

import com.nexora.backend.dto.AiRequestDto;
import com.nexora.backend.dto.AiResponseDto;

public interface AiAssistantService {
    AiResponseDto processPrompt(AiRequestDto request);
}
