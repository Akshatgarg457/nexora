package com.nexora.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learning_resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // AI Agents, Spring Boot, Cloud Computing, Cybersecurity, Data Analytics

    @Column(length = 2000)
    private String description;

    private String resourceUrl;
    private String estimatedTime; // e.g. "4 hours"
    private String level; // Beginner, Intermediate, Advanced

    @Column(length = 4000)
    private String sampleTranscript;
}
