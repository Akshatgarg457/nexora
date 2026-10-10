package com.nexora.backend.controller;

import com.nexora.backend.dto.CreateMeetingRequest;
import com.nexora.backend.dto.MeetingDto;
import com.nexora.backend.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MeetingController {

    private final MeetingService meetingService;

    @GetMapping
    public ResponseEntity<List<MeetingDto>> getAllMeetings() {
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingDto> getMeetingById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingById(id));
    }

    @PostMapping
    public ResponseEntity<MeetingDto> createMeeting(@Valid @RequestBody CreateMeetingRequest request) {
        MeetingDto created = meetingService.createMeeting(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
