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
    private MaterialRepository materialRepo;
    @Autowired
    private LocationRepository locationRepo;
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
        if (locationRepo.count() == 0) {
            initLocations();
        }
        if (hierarchyRepo.count() == 0) {
            initPackaging();
        }
        if (inventoryRepo.count() == 0) {
            initInventory();
        }
    }

    private void initMaterials() {
        Material m1 = new Material();
        m1.setCode("MAT-001");
        m1.setName("Premium Widget");
        m1.setDescription("High-quality widget for industrial use");
        m1.setBaseUom("EA");
        m1.setNetWeight(0.5);
        m1.setType("FIN");
        m1.setIsSerialManaged(true);
        m1.setIsBatchManaged(true);
        materialRepo.save(m1);

        Material m2 = new Material();
        m2.setCode("MAT-002");
        m2.setName("Standard Gadget");
        m2.setDescription("Standard gadget for consumer use");
        m2.setBaseUom("EA");
        m2.setNetWeight(0.2);
        m2.setType("FIN");
        m2.setIsSerialManaged(false);
        m2.setIsBatchManaged(false);
        materialRepo.save(m2);
    }

    private void initLocations() {
        Location w1 = new Location();
        w1.setCode("WH-MAIN");
        w1.setName("Main Distribution Center");
        w1.setAddressLine1("New York, NY");
        w1.setType("WAREHOUSE");
        w1.setCategory("GENERAL");
        locationRepo.save(w1);

        Location l1 = new Location();
        l1.setCode("LOC-A1");
        l1.setName("Aisle 1, Shelf 1");
        l1.setType("SHELF");
        l1.setParent(w1);
        locationRepo.save(l1);
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
        Material m1 = materialRepo.findByCode("MAT-001").orElse(null);
        Location l1 = locationRepo.findByCode("LOC-A1").orElse(null);

        if (m1 != null && l1 != null) {
            Inventory inv1 = new Inventory();
            inv1.setMaterial(m1);
            inv1.setSerialNumber("SN-001-1001");
            inv1.setBatchNumber("BATCH-2023-001");
            inv1.setStatus("REGISTERED");
            inv1.setLocation(l1);
            inventoryRepo.save(inv1);

            Inventory inv2 = new Inventory();
            inv2.setMaterial(m1);
            inv2.setSerialNumber("SN-001-1002");
            inv2.setBatchNumber("BATCH-2023-001");
            inv2.setStatus("REGISTERED");
            inv2.setLocation(l1);
            inventoryRepo.save(inv2);
        }
    }
}
