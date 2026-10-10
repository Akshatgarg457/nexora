package com.nexora.backend.repository;

import com.nexora.backend.entity.ProgressReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long> {
    List<ProgressReport> findByProjectIdOrderByReportDateDesc(Long projectId);
}
