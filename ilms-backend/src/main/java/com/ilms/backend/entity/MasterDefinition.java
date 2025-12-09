package com.ilms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "master_definitions", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "def_type", "def_value" })
})
@Getter
@Setter
public class MasterDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "def_type", nullable = false)
    private String defType; // e.g. 'MATERIAL_TYPE', 'LOCATION_TYPE'

    @Column(name = "def_value", nullable = false)
    private String defValue;

    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
