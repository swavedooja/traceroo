package com.ilms.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "materials")
@Getter
@Setter
public class Material {
    @Id
    private String id; // UUID

    @NotBlank
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    private String description;

    // Type & Classification
    private String type; // FK to master_definitions
    private String category; // FK to master_definitions
    private String status; // ACTIVE, OBSOLETE, etc.

    // Base Units
    @Column(name = "base_uom")
    private String baseUom;

    // Track & Trace
    @Column(name = "is_batch_managed")
    private Boolean isBatchManaged = false;

    @Column(name = "is_serial_managed")
    private Boolean isSerialManaged = false;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(name = "min_stock")
    private Double minStock;

    @Column(name = "max_stock")
    private Double maxStock;

    // Physical
    @Column(name = "gross_weight")
    private Double grossWeight;

    @Column(name = "net_weight")
    private Double netWeight;

    @Column(name = "weight_uom")
    private String weightUom;

    private Double length;
    private Double width;
    private Double height;

    @Column(name = "dimension_uom")
    private String dimensionUom;

    private Double volume;

    @Column(name = "volume_uom")
    private String volumeUom;

    // Hazmat
    @Column(name = "is_hazmat")
    private Boolean isHazmat = false;

    @Column(name = "hazmat_class")
    private String hazmatClass;

    @Column(name = "un_number")
    private String unNumber;

    // Audit
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    // Note: HandlingParameter relationship removed for now unless critical, can be
    // re-added mapping to 'material_id'
    // @OneToOne(mappedBy = "material") ...

    @PrePersist
    public void prePersist() {
        if (id == null)
            id = UUID.randomUUID().toString();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
