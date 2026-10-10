package com.nexora.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workspace_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspacePreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long employeeId;

    @Column(length = 2000)
    private String customPrompt;

    @Column(length = 2000)
    private String prioritizedWorkspaces; // comma-separated workspace keys e.g. "PROJECTS,STUDY,MEETINGS"

    @Column(length = 2000)
    private String explanationText;
}
