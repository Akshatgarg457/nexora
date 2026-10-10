package com.nexora.backend.repository;

import com.nexora.backend.entity.ProjectTask;
import com.nexora.backend.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<ProjectTask, Long> {
    List<ProjectTask> findByProjectId(Long projectId);
    List<ProjectTask> findByAssigneeId(Long assigneeId);
    List<ProjectTask> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
}
