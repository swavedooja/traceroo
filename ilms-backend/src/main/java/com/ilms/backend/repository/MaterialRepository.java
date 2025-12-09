package com.ilms.backend.repository;

import com.ilms.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, String> {
    Optional<Material> findByCode(String code);

    void deleteByCode(String code);
}
