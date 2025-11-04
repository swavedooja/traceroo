package com.ilms.backend.repository;

import com.ilms.backend.entity.MaterialDocument;
import com.ilms.backend.entity.MaterialMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialDocumentRepository extends JpaRepository<MaterialDocument, Long> {
    List<MaterialDocument> findByMaterial(MaterialMaster material);
}
