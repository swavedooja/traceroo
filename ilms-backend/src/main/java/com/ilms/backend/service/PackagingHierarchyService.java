package com.ilms.backend.service;

import com.ilms.backend.dto.PackagingHierarchyDTO;
import com.ilms.backend.dto.PackagingLevelDTO;
import com.ilms.backend.entity.PackagingHierarchy;
import com.ilms.backend.entity.PackagingLevel;
import com.ilms.backend.repository.PackagingHierarchyRepository;
import com.ilms.backend.repository.PackagingLevelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PackagingHierarchyService {
    private final PackagingHierarchyRepository hierarchyRepo;
    private final PackagingLevelRepository levelRepo;

    public PackagingHierarchyService(PackagingHierarchyRepository hierarchyRepo, PackagingLevelRepository levelRepo) {
        this.hierarchyRepo = hierarchyRepo;
        this.levelRepo = levelRepo;
    }

    @Transactional
    public PackagingHierarchy save(PackagingHierarchyDTO dto) {
        PackagingHierarchy h = dto.getId() != null ? hierarchyRepo.findById(dto.getId()).orElse(new PackagingHierarchy()) : new PackagingHierarchy();
        h.setName(dto.getName());
        h.setActivationFrom(dto.getActivationFrom());
        h.setActivationTo(dto.getActivationTo());
        h.setPackagingCapacityConstraints(Boolean.TRUE.equals(dto.getPackagingCapacityConstraints()));
        h.setGtinAssignmentFormat(dto.getGtinAssignmentFormat());
        h.setDescription(dto.getDescription());

        // Clear and recreate levels for simplicity
        if (h.getId() != null) {
            h.getLevels().clear();
        }

        List<PackagingLevel> levels = new ArrayList<>();
        if (dto.getLevels() != null) {
            for (PackagingLevelDTO l : dto.getLevels()) {
                PackagingLevel pl = new PackagingLevel();
                pl.setHierarchy(h);
                pl.setLevelIndex(l.getLevelIndex());
                pl.setLevelCode(l.getLevelCode());
                pl.setLevelName(l.getLevelName());
                pl.setContainedQuantity(l.getContainedQuantity());
                pl.setDimensionsMM(l.getDimensionsMM());
                pl.setWeightKg(l.getWeightKg());
                pl.setCapacityUnits(l.getCapacityUnits());
                pl.setIdTech(l.getIdTech());
                pl.setBarcodeType(l.getBarcodeType());
                pl.setRfidTagType(l.getRfidTagType());
                pl.setEpcFormat(l.getEpcFormat());
                pl.setLabelTemplate(l.getLabelTemplate());
                pl.setGtinFormat(l.getGtinFormat());
                pl.setDefaultLabelCopies(l.getDefaultLabelCopies());
                pl.setIsReturnable(l.getIsReturnable());
                pl.setIsSerialized(l.getIsSerialized());
                levels.add(pl);
            }
        }
        h.setLevels(levels);
        return hierarchyRepo.save(h);
    }

    public Optional<PackagingHierarchy> get(Long id) {
        return hierarchyRepo.findById(id);
    }

    public void delete(Long id) {
        hierarchyRepo.deleteById(id);
    }

    public Map<String, Object> preview(Long id) {
        PackagingHierarchy h = hierarchyRepo.findById(id).orElseThrow();
        // levels are ordered by levelIndex asc (1=innermost)
        List<PackagingLevel> levels = h.getLevels();
        List<Map<String, Object>> perLevel = new ArrayList<>();
        long runningProduct = 1;
        for (int i = 0; i < levels.size(); i++) {
            PackagingLevel level = levels.get(i);
            if (i > 0) {
                // multiply by contained quantity of current level
                runningProduct *= Optional.ofNullable(level.getContainedQuantity()).orElse(1);
            }
            long totalBaseItems = 1;
            for (int j = i; j >= 0; j--) {
                int q = Optional.ofNullable(levels.get(j).getContainedQuantity()).orElse(1);
                if (j == 0) {
                    totalBaseItems *= 1; // Level 1 assumed base item count 1
                } else {
                    totalBaseItems *= q;
                }
            }
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("levelIndex", level.getLevelIndex());
            row.put("levelName", level.getLevelName());
            row.put("containedQuantity", level.getContainedQuantity());
            row.put("totalBaseItems", totalBaseItems);
            row.put("idTech", level.getIdTech());
            perLevel.add(row);
        }

        // Human-readable lines e.g., "1 PALLET - 50 CARTONS = 600 ITEMS"
        List<String> human = new ArrayList<>();
        for (int i = levels.size() - 1; i >= 1; i--) {
            PackagingLevel outer = levels.get(i);
            PackagingLevel inner = levels.get(i - 1);
            int q = Optional.ofNullable(outer.getContainedQuantity()).orElse(1);
            long innerTotal = 1;
            for (int j = i - 1; j >= 0; j--) {
                int q2 = Optional.ofNullable(levels.get(j).getContainedQuantity()).orElse(1);
                if (j == 0) innerTotal *= 1; else innerTotal *= q2;
            }
            long total = q * innerTotal;
            human.add("1 " + outer.getLevelName() + " - " + q + " " + inner.getLevelName() + " = " + total + " ITEMS");
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("hierarchyId", h.getId());
        result.put("name", h.getName());
        result.put("levels", perLevel);
        result.put("summary", human);
        return result;
    }
}
