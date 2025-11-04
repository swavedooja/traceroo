package com.ilms.backend.dto;

import lombok.Data;

@Data
public class MaterialImageDTO {
    private Long id;
    private String type;
    private String filename;
    private String url;
}
