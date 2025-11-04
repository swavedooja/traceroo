package com.ilms.backend.dto;

import lombok.Data;

@Data
public class PackagingLevelDTO {
    private Long id;
    private Integer levelIndex;
    private String levelCode;
    private String levelName;
    private Integer containedQuantity;
    private String dimensionsMM;
    private Double weightKg;
    private String capacityUnits;
    private String idTech;
    private String barcodeType;
    private String rfidTagType;
    private String epcFormat;
    private String labelTemplate;
    private String gtinFormat;
    private Integer defaultLabelCopies;
    private Boolean isReturnable;
    private Boolean isSerialized;
}
