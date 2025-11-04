package com.ilms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packaging_hierarchy")
@Getter
@Setter
public class PackagingHierarchy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDate activationFrom;
    private LocalDate activationTo;
    private Boolean packagingCapacityConstraints;
    private String gtinAssignmentFormat;
    private String description;

    @OneToMany(mappedBy = "hierarchy", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("levelIndex ASC")
    private List<PackagingLevel> levels = new ArrayList<>();
}
