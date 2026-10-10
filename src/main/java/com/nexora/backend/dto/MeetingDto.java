package com.nexora.backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private EmployeeDto organizer;
    private List<EmployeeDto> participants;
    private String agenda;
    private String notes;
    private String status;
}
