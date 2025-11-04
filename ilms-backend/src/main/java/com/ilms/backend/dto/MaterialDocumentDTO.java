package com.ilms.backend.dto;

import lombok.Data;

@Data
public class MaterialDocumentDTO {
    private Long id;
    private String docType;
    private String filename;
    private String url;
}
