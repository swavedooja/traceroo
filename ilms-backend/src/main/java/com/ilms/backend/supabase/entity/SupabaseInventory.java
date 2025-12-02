package com.ilms.backend.supabase.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter
@Setter
public class SupabaseInventory {
    @Id
    private Long id; // Sync ID from SQLite

    @Column(name = "material_code")
    private String materialCode;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "batch_number")
    private String batchNumber;

    private String status;

    @Column(name = "warehouse_code")
    private String warehouseCode;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
