package com.nexora.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMeetingRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    @NotNull(message = "Date is required")
    private LocalDate date;
    @NotNull(message = "Time is required")
    private LocalTime time;
    private String location;
    @NotNull(message = "Organizer ID is required")
    private Long organizerId;
    private List<Long> participantIds;
    private String agenda;
    private String notes;
}
