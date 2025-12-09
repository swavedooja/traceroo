package com.ilms.backend.service;

import com.ilms.backend.entity.Material;
import com.ilms.backend.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MaterialService {
    private final MaterialRepository repo;

    public MaterialService(MaterialRepository repo) {
        this.repo = repo;
    }

    public List<Material> list() {
        return repo.findAll();
    }

    public Optional<Material> get(String code) {
        return repo.findByCode(code);
    }

    public Material save(Material material) {
        return repo.save(material);
    }

    public void delete(String code) {
        repo.deleteByCode(code);
    }
}
