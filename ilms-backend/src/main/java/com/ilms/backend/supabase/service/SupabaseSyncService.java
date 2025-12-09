package com.ilms.backend.supabase.service;

import com.ilms.backend.entity.*;
import com.ilms.backend.repository.*;
import com.ilms.backend.supabase.entity.*;
import com.ilms.backend.supabase.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;

import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "supabase.sync.enabled", havingValue = "true")
public class SupabaseSyncService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseSyncService.class);

    @Autowired
    private MaterialRepository sqliteMaterialRepository; // Updated

    @Autowired
    private SupabaseMaterialRepository supabaseMaterialRepository; // Updated

    @Autowired
    private HandlingParameterRepository sqliteHandlingParameterRepository;

    @Autowired
    private MaterialImageRepository sqliteMaterialImageRepository;

    @Autowired
    private MaterialDocumentRepository sqliteMaterialDocumentRepository;

    @Autowired
    private PackagingHierarchyRepository sqlitePackagingHierarchyRepository;

    @Autowired
    private PackagingLevelRepository sqlitePackagingLevelRepository;

    @Autowired
    private InventoryRepository sqliteInventoryRepository;

    @Autowired
    private SupabaseHandlingParameterRepository supabaseHandlingParameterRepository;

    @Autowired
    private SupabaseMaterialImageRepository supabaseMaterialImageRepository;

    @Autowired
    private SupabaseMaterialDocumentRepository supabaseMaterialDocumentRepository;

    @Autowired
    private SupabasePackagingHierarchyRepository supabasePackagingHierarchyRepository;

    @Autowired
    private SupabasePackagingLevelRepository supabasePackagingLevelRepository;

    @Autowired
    private SupabaseInventoryRepository supabaseInventoryRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        logger.info("SupabaseSyncService initialized. Triggering initial sync...");
        syncDataToSupabase();
    }

    @Scheduled(fixedRate = 60000)
    public void syncDataToSupabase() {
        logger.info("Starting sync to Supabase...");
        try {
            syncMaterials();
            syncHandlingParameterData();
            syncMaterialImageData();
            syncMaterialDocumentData();
            syncPackagingHierarchyData();
            syncPackagingLevelData();
            syncInventoryData();
            logger.info("Sync to Supabase completed successfully.");
        } catch (Exception e) {
            logger.error("Error during Supabase sync", e);
        }
    }

    private void syncMaterials() {
        List<Material> sqliteMaterials = sqliteMaterialRepository.findAll();

        for (Material m : sqliteMaterials) {
            Optional<SupabaseMaterial> existing = supabaseMaterialRepository.findByCode(m.getCode());
            SupabaseMaterial sm;
            if (existing.isPresent()) {
                sm = existing.get();
                // Ensure ID assumes existing if needed, or if ID is different? Material uses
                // UUID now.
                // Assuming ID sync is handled by code lookup or we just update fields.
            } else {
                sm = new SupabaseMaterial();
                sm.setCode(m.getCode());
                sm.setId(m.getId()); // Sync ID
            }

            sm.setName(m.getName());
            sm.setDescription(m.getDescription());
            sm.setType(m.getType());
            sm.setCategory(m.getCategory());
            sm.setStatus(m.getStatus());
            sm.setBaseUom(m.getBaseUom());
            sm.setIsBatchManaged(m.getIsBatchManaged());
            sm.setIsSerialManaged(m.getIsSerialManaged());
            sm.setShelfLifeDays(m.getShelfLifeDays());
            sm.setMinStock(m.getMinStock());
            sm.setMaxStock(m.getMaxStock());
            sm.setGrossWeight(m.getGrossWeight());
            sm.setNetWeight(m.getNetWeight());
            sm.setWeightUom(m.getWeightUom());
            sm.setLength(m.getLength());
            sm.setWidth(m.getWidth());
            sm.setHeight(m.getHeight());
            sm.setDimensionUom(m.getDimensionUom());
            sm.setVolume(m.getVolume());
            sm.setVolumeUom(m.getVolumeUom());
            sm.setIsHazmat(m.getIsHazmat());
            sm.setHazmatClass(m.getHazmatClass());
            sm.setUnNumber(m.getUnNumber());
            sm.setCreatedAt(m.getCreatedAt());
            sm.setUpdatedAt(m.getUpdatedAt());

            supabaseMaterialRepository.save(sm);
        }
    }

    private void syncHandlingParameterData() {
        List<HandlingParameter> params = sqliteHandlingParameterRepository.findAll();
        for (HandlingParameter p : params) {
            if (p.getMaterial() == null)
                continue;
            // Lookup by material code
            Optional<SupabaseHandlingParameter> existing = supabaseHandlingParameterRepository
                    .findByMaterialCode(p.getMaterial().getCode()); // Use getCode()

            SupabaseHandlingParameter sp;
            if (existing.isPresent()) {
                sp = existing.get();
            } else {
                sp = new SupabaseHandlingParameter();
                sp.setMaterialCode(p.getMaterial().getCode());
            }

            sp.setTemperatureMin(p.getTemperatureMin());
            sp.setTemperatureMax(p.getTemperatureMax());
            sp.setHumidityMin(p.getHumidityMin());
            sp.setHumidityMax(p.getHumidityMax());
            sp.setHazardousClass(p.getHazardousClass());
            sp.setPrecautions(p.getPrecautions());
            sp.setEnvParameters(p.getEnvParameters());
            sp.setEpcFormat(p.getEpcFormat());

            supabaseHandlingParameterRepository.save(sp);
        }
    }

    private void syncMaterialImageData() {
        List<MaterialImage> images = sqliteMaterialImageRepository.findAll();
        for (MaterialImage img : images) {
            if (img.getMaterial() == null)
                continue;
            Optional<SupabaseMaterialImage> existing = supabaseMaterialImageRepository.findById(img.getId());
            SupabaseMaterialImage sImg = existing.orElse(new SupabaseMaterialImage());

            sImg.setMaterialCode(img.getMaterial().getCode()); // Use getCode()
            sImg.setType(img.getType());
            sImg.setFilename(img.getFilename());
            sImg.setUrl(img.getUrl());
            supabaseMaterialImageRepository.save(sImg);
        }
    }

    private void syncMaterialDocumentData() {
        List<MaterialDocument> docs = sqliteMaterialDocumentRepository.findAll();
        for (MaterialDocument doc : docs) {
            if (doc.getMaterial() == null)
                continue;
            Optional<SupabaseMaterialDocument> existing = supabaseMaterialDocumentRepository.findById(doc.getId());
            SupabaseMaterialDocument sDoc = existing.orElse(new SupabaseMaterialDocument());

            sDoc.setMaterialCode(doc.getMaterial().getCode()); // Use getCode()
            sDoc.setDocType(doc.getDocType());
            sDoc.setFilename(doc.getFilename());
            sDoc.setUrl(doc.getUrl());
            supabaseMaterialDocumentRepository.save(sDoc);
        }
    }

    // ... Other sync methods (PackagingHierarchy, PackagingLevel) remain largely
    // same unless they linked to Material
    // PackagingLevel might link to LabelTemplate which links to Material, but sync
    // logic for PackagingLevel doesn't traverse deep usually.

    private void syncPackagingHierarchyData() {
        List<PackagingHierarchy> items = sqlitePackagingHierarchyRepository.findAll();
        for (PackagingHierarchy item : items) {
            SupabasePackagingHierarchy sItem = supabasePackagingHierarchyRepository.findById(item.getId())
                    .orElse(new SupabasePackagingHierarchy());
            sItem.setName(item.getName());
            sItem.setActivationFrom(item.getActivationFrom());
            sItem.setActivationTo(item.getActivationTo());
            sItem.setPackagingCapacityConstraints(item.getPackagingCapacityConstraints());
            sItem.setGtinAssignmentFormat(item.getGtinAssignmentFormat());
            sItem.setDescription(item.getDescription());
            supabasePackagingHierarchyRepository.save(sItem);
        }
    }

    private void syncPackagingLevelData() {
        List<PackagingLevel> items = sqlitePackagingLevelRepository.findAll();
        for (PackagingLevel item : items) {
            SupabasePackagingLevel sItem = supabasePackagingLevelRepository.findById(item.getId())
                    .orElse(new SupabasePackagingLevel());
            if (item.getHierarchy() != null)
                sItem.setHierarchyId(item.getHierarchy().getId());
            sItem.setLevelIndex(item.getLevelIndex());
            sItem.setLevelCode(item.getLevelCode());
            sItem.setLevelName(item.getLevelName());
            sItem.setContainedQuantity(item.getContainedQuantity());
            sItem.setDimensionsMM(item.getDimensionsMM());
            sItem.setWeightKg(item.getWeightKg());
            sItem.setCapacityUnits(item.getCapacityUnits());
            sItem.setIdTech(item.getIdTech());
            sItem.setBarcodeType(item.getBarcodeType());
            sItem.setRfidTagType(item.getRfidTagType());
            sItem.setEpcFormat(item.getEpcFormat());
            // Label Template? sItem.setLabelTemplate(item.getLabelTemplate());
            sItem.setGtinFormat(item.getGtinFormat());
            sItem.setDefaultLabelCopies(item.getDefaultLabelCopies());
            sItem.setReturnable(item.getIsReturnable());
            sItem.setSerialized(item.getIsSerialized());
            supabasePackagingLevelRepository.save(sItem);
        }
    }

    private void syncInventoryData() {
        List<Inventory> invList = sqliteInventoryRepository.findAll();
        for (Inventory inv : invList) {
            SupabaseInventory sInv = supabaseInventoryRepository.findById(inv.getId()).orElse(new SupabaseInventory());
            if (inv.getId() != null)
                sInv.setId(inv.getId());

            if (inv.getMaterial() != null)
                sInv.setMaterialCode(inv.getMaterial().getCode()); // Use getCode()
            sInv.setSerialNumber(inv.getSerialNumber());
            sInv.setBatchNumber(inv.getBatchNumber());
            sInv.setStatus(inv.getStatus());
            if (inv.getLocation() != null) {
                sInv.setLocationCode(inv.getLocation().getCode());
            }
            sInv.setCreatedAt(inv.getCreatedAt());
            supabaseInventoryRepository.save(sInv);
        }
    }
}