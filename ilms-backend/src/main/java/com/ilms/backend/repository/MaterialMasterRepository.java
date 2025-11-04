package com.ilms.backend.repository;

import com.ilms.backend.entity.MaterialMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialMasterRepository extends JpaRepository<MaterialMaster, String> {
    Page<MaterialMaster> findByMaterialCodeContainingIgnoreCaseOrMaterialNameContainingIgnoreCase(String code, String name, Pageable pageable);
}
