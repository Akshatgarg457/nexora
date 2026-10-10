package com.nexora.backend.service;

import com.nexora.backend.dto.CreateMeetingRequest;
import com.nexora.backend.dto.MeetingDto;
import com.nexora.backend.entity.Employee;
import com.nexora.backend.entity.Meeting;
import com.nexora.backend.repository.EmployeeRepository;
import com.nexora.backend.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    public List<MeetingDto> getAllMeetings() {
        return meetingRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MeetingDto getMeetingById(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found with id: " + id));
        return mapToDto(meeting);
    }

    @Transactional
    public MeetingDto createMeeting(CreateMeetingRequest request) {
        Employee organizer = employeeRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Organizer employee not found"));

        Set<Employee> participants = new HashSet<>();
        if (request.getParticipantIds() != null && !request.getParticipantIds().isEmpty()) {
            participants.addAll(employeeRepository.findAllById(request.getParticipantIds()));
        }

        String status = "UPCOMING";
        if (request.getDate() != null && request.getDate().isBefore(LocalDate.now())) {
            status = "PAST";
        }

        Meeting meeting = Meeting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .date(request.getDate())
                .time(request.getTime())
                .location(request.getLocation() != null ? request.getLocation() : "Sakura Digital Workspace Room 1")
                .organizer(organizer)
                .participants(participants)
                .agenda(request.getAgenda())
                .notes(request.getNotes())
                .status(status)
                .build();

        Meeting saved = meetingRepository.save(meeting);
        return mapToDto(saved);
    }

    public MeetingDto mapToDto(Meeting meeting) {
        if (meeting == null) return null;
        return MeetingDto.builder()
                .id(meeting.getId())
                .title(meeting.getTitle())
                .description(meeting.getDescription())
                .date(meeting.getDate())
                .time(meeting.getTime())
                .location(meeting.getLocation())
                .organizer(employeeService.mapToDto(meeting.getOrganizer()))
                .participants(meeting.getParticipants().stream().map(employeeService::mapToDto).collect(Collectors.toList()))
                .agenda(meeting.getAgenda())
                .notes(meeting.getNotes())
                .status(meeting.getStatus())
                .build();
    }
}
