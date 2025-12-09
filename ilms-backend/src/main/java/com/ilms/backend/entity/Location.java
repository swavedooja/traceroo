package com.ilms.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "locations")
@Getter
@Setter
public class Location {
    @Id
    private String id; // UUID

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    private String type; // FK to master_definitions
    private String category; // FK to master_definitions

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Location parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Location> children;

    private String status;

    // Address
    @Column(name = "address_line1")
    private String addressLine1;
    private String city;
    private String state;
    private String country;
    @Column(name = "zip_code")
    private String zipCode;
    private Double latitude;
    private Double longitude;

    // Capacity
    @Column(name = "capacity_volume")
    private Double capacityVolume;
    @Column(name = "capacity_weight")
    private Double capacityWeight;
    @Column(name = "current_utilization")
    private Double currentUtilization;

    // Track & Trace
    private String gln;
    @Column(name = "rfid_reader_id")
    private String rfidReaderId;
    @Column(name = "is_quarantine")
    private Boolean isQuarantine = false;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = java.util.UUID.randomUUID().toString();
        }
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
