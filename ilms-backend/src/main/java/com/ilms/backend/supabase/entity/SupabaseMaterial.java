package com.ilms.backend.supabase.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
@Getter
@Setter
public class SupabaseMaterial {
    @Id
    private String id; // UUID

    @Column(name = "code", nullable = false, unique = true)
    private String code;

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
    private Boolean isBatchManaged;

    @Column(name = "is_serial_managed")
    private Boolean isSerialManaged;

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
    private Boolean isHazmat;

    @Column(name = "hazmat_class")
    private String hazmatClass;

    @Column(name = "un_number")
    private String unNumber;

    // Audit
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
