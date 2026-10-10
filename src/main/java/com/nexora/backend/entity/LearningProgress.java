package com.nexora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private LearningResource resource;

    @Enumerated(EnumType.STRING)
    private LearningStatus status;

    private Integer progressPercentage; // 0 to 100

    @Column(length = 4000)
    private String videoNotes;

    @Column(length = 2000)
    private String aiSummary;

    private LocalDateTime lastAccessed;
}
