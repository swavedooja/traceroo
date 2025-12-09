package com.ilms.backend.service;

import com.ilms.backend.entity.MasterDefinition;
import com.ilms.backend.repository.MasterDefinitionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MasterDefinitionService {
    private final MasterDefinitionRepository repo;

    public MasterDefinitionService(MasterDefinitionRepository repo) {
        this.repo = repo;
    }

    public List<MasterDefinition> listAll() {
        return repo.findAll();
    }

    public List<MasterDefinition> listByType(String type) {
        return repo.findByDefTypeAndIsActiveTrue(type);
    }

    public MasterDefinition save(MasterDefinition def) {
        return repo.save(def);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
