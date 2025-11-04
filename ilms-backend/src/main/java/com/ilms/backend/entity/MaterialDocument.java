package com.ilms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "material_document")
@Getter
@Setter
public class MaterialDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_code", referencedColumnName = "material_code")
    private MaterialMaster material;

    private String docType; // MSDS | Technical | Certificate
    private String filename;
    private String url;
}
