package com.ilms.backend.config;

import com.ilms.backend.entity.*;
import com.ilms.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
public class DemoDataInitializer implements CommandLineRunner {

    @Autowired
    private MaterialMasterRepository materialRepo;
    @Autowired
    private WarehouseRepository warehouseRepo;
    @Autowired
    private StorageLocationRepository storageLocationRepo;
    @Autowired
    private PackagingHierarchyRepository hierarchyRepo;
    @Autowired
    private PackagingLevelRepository levelRepo;
    @Autowired
    private InventoryRepository inventoryRepo;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (materialRepo.count() == 0) {
            initMaterials();
        }
        if (warehouseRepo.count() == 0) {
            initWarehouses();
        }
        if (hierarchyRepo.count() == 0) {
            initPackaging();
        }
        if (inventoryRepo.count() == 0) {
            initInventory();
        }
    }

    private void initMaterials() {
        MaterialMaster m1 = new MaterialMaster();
        m1.setMaterialCode("MAT-001");
        m1.setMaterialName("Premium Widget");
        m1.setDescription("High-quality widget for industrial use");
        m1.setSku("SKU-WID-001");
        m1.setBaseUOM("EA");
        m1.setNetWeightKg(0.5);
        m1.setCountryOfOrigin("US");
        m1.setType("Finished Goods");
        m1.setIsSerialized(true);
        m1.setIsBatchManaged(true);
        materialRepo.save(m1);

        MaterialMaster m2 = new MaterialMaster();
        m2.setMaterialCode("MAT-002");
        m2.setMaterialName("Standard Gadget");
        m2.setDescription("Standard gadget for consumer use");
        m2.setSku("SKU-GAD-002");
        m2.setBaseUOM("EA");
        m2.setNetWeightKg(0.2);
        m2.setCountryOfOrigin("CN");
        m2.setType("Finished Goods");
        m2.setIsSerialized(false);
        m2.setIsBatchManaged(false);
        materialRepo.save(m2);
    }

    private void initWarehouses() {
        Warehouse w1 = new Warehouse();
        w1.setWarehouseCode("WH-MAIN");
        w1.setWarehouseName("Main Distribution Center");
        w1.setLocation("New York, NY");
        warehouseRepo.save(w1);

        StorageLocation sl1 = new StorageLocation();
        sl1.setLocationCode("LOC-A1");
        sl1.setDescription("Aisle 1, Shelf 1");
        sl1.setWarehouse(w1);
        storageLocationRepo.save(sl1);
    }

    private void initPackaging() {
        PackagingHierarchy h1 = new PackagingHierarchy();
        h1.setName("Standard Export Hierarchy");
        h1.setDescription("Box -> Pallet -> Container");
        h1.setActivationFrom(LocalDate.now());
        hierarchyRepo.save(h1);

        PackagingLevel l1 = new PackagingLevel();
        l1.setHierarchy(h1);
        l1.setLevelIndex(1);
        l1.setLevelName("Box");
        l1.setLevelCode("BOX");
        l1.setContainedQuantity(10);
        levelRepo.save(l1);

        PackagingLevel l2 = new PackagingLevel();
        l2.setHierarchy(h1);
        l2.setLevelIndex(2);
        l2.setLevelName("Pallet");
        l2.setLevelCode("PAL");
        l2.setContainedQuantity(50);
        levelRepo.save(l2);
    }

    private void initInventory() {
        MaterialMaster m1 = materialRepo.findById("MAT-001").orElse(null);
        Warehouse w1 = warehouseRepo.findById("WH-MAIN").orElse(null);
        StorageLocation sl1 = storageLocationRepo.findById(1L).orElse(null); // Assuming ID 1

        if (m1 != null && w1 != null) {
            Inventory inv1 = new Inventory();
            inv1.setMaterial(m1);
            inv1.setSerialNumber("SN-001-1001");
            inv1.setBatchNumber("BATCH-2023-001");
            inv1.setStatus("REGISTERED");
            inv1.setWarehouse(w1);
            inv1.setLocation(sl1);
            inventoryRepo.save(inv1);

            Inventory inv2 = new Inventory();
            inv2.setMaterial(m1);
            inv2.setSerialNumber("SN-001-1002");
            inv2.setBatchNumber("BATCH-2023-001");
            inv2.setStatus("REGISTERED");
            inv2.setWarehouse(w1);
            inv2.setLocation(sl1);
            inventoryRepo.save(inv2);
        }
    }
}
