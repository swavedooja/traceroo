package com.ilms.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "handling_parameter")
@Getter
@Setter
public class HandlingParameter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "material_id")
    private Material material;

    private Double temperatureMin;
    private Double temperatureMax;
    private Double humidityMin;
    private Double humidityMax;
    private String hazardousClass;
    private String precautions;
    private String envParameters;
    private String epcFormat;
}
