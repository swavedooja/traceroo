package com.ilms.backend.repository;

import com.ilms.backend.entity.MaterialImage;
import com.ilms.backend.entity.MaterialMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialImageRepository extends JpaRepository<MaterialImage, Long> {
    List<MaterialImage> findByMaterial(MaterialMaster material);
}
