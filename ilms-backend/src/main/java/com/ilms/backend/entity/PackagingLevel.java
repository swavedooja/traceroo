package com.ilms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "packaging_level")
@Getter
@Setter
public class PackagingLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hierarchy_id")
    private PackagingHierarchy hierarchy;

    private Integer levelIndex; // 1 = innermost
    private String levelCode;   // L1, L2, ...
    private String levelName;   // ITEM, CARTON, ...
    private Integer containedQuantity; // items of next inner level

    private String dimensionsMM; // LxWxH
    private Double weightKg;
    private String capacityUnits;

    private String idTech; // BARCODE, RFID, BLE
    private String barcodeType;
    private String rfidTagType;
    private String epcFormat;
    private String labelTemplate;
    private String gtinFormat;
    private Integer defaultLabelCopies;
    private Boolean isReturnable;
    private Boolean isSerialized;
}
