package com.nexora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private LocalDate date;
    private LocalTime time;
    private String location; // e.g. "Sakura Conference Room A" or "Virtual Link"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id")
    private Employee organizer;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "meeting_participants",
        joinColumns = @JoinColumn(name = "meeting_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    @Builder.Default
    private Set<Employee> participants = new HashSet<>();

    @Column(length = 2000)
    private String agenda;

    @Column(length = 2000)
    private String notes;

    private String status; // UPCOMING, PAST, CANCELLED
}
