package com.nexora.backend.dto;

import lombok.*;
import java.util.Map;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDto {
    private long totalEmployees;
    private long activeProjectsCount;
    private long completedProjectsCount;
    private long totalTasksCount;
    private long completedTasksCount;
    private long overdueTasksCount;
    private double taskCompletionRate; // e.g. 78.5%
    private long upcomingMeetingsCount;
    private double avgProjectCompletion;
    private long activeLearnersCount;
    private String dataSourceNote;

    private Map<String, Long> projectStatusDistribution;
    private Map<String, Long> taskStatusDistribution;
    private List<CategoryMetric> learningCategoryStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryMetric {
        private String category;
        private long totalResources;
        private long completedCount;
    }
}
