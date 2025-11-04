package com.ilms.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PackagingHierarchyDTO {
    private Long id;
    private String name;
    private LocalDate activationFrom;
    private LocalDate activationTo;
    private Boolean packagingCapacityConstraints;
    private String gtinAssignmentFormat;
    private String description;
    private List<PackagingLevelDTO> levels;
}
