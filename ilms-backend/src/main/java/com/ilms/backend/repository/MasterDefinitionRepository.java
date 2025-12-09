package com.ilms.backend.repository;

import com.ilms.backend.entity.MasterDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MasterDefinitionRepository extends JpaRepository<MasterDefinition, Long> {
    List<MasterDefinition> findByDefType(String defType);

    List<MasterDefinition> findByDefTypeAndIsActiveTrue(String defType);
}
