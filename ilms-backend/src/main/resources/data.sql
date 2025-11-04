-- Seed materials
INSERT OR IGNORE INTO material_master (
  material_code, material_name, description, sku, country_of_origin, type, material_class, material_group,
  gs1_category_code, shelf_life_days, storage_type, procurement_type, baseuom, net_weight_kg, dimensionsmm,
  tradeuom, trade_weight_kg, trade_dimensionsmm, is_packaged, is_fragile, is_env_sensitive, is_high_value,
  is_batch_managed, packaging_material_code, is_serialized, externalerpcode, item_weight, item_dimension,
  max_storage_period, material_eanupc, ean_gtin, upc
) VALUES
('MAT-2024-0001','Shampoo Bottle 100ML','Gentle daily use','SB-100','IN','FINISHED','COSMETICS','PERSONAL_CARE','123456',730,'COOL_STORAGE','MAKE_TO_STOCK','EA',0.12,'45x45x120','BOX',1.5,'200x200x150',1,0,0,0,1,'PM-PLASTIC-01',0,'ERP-EXT-001','120g','45x45x120mm','24M','8901234567890','08901234567890','012345678905'),
('MAT-2024-0002','Conditioner 100ML','Silky smooth','CD-100','IN','FINISHED','COSMETICS','PERSONAL_CARE','123456',730,'COOL_STORAGE','MAKE_TO_STOCK','EA',0.12,'45x45x120','BOX',1.5,'200x200x150',1,0,0,0,0,'PM-PLASTIC-01',0,'ERP-EXT-002','120g','45x45x120mm','24M','8901234567891','08901234567891','012345678906'),
('MAT-2024-0003','Body Wash 200ML','Fresh scent','BW-200','IN','FINISHED','COSMETICS','PERSONAL_CARE','123456',730,'COOL_STORAGE','MAKE_TO_STOCK','EA',0.22,'55x55x160','BOX',2.0,'220x220x160',1,0,0,0,0,'PM-PLASTIC-02',0,'ERP-EXT-003','220g','55x55x160mm','24M','8901234567892','08901234567892','012345678907');

INSERT OR IGNORE INTO handling_parameter (
  material_code, temperature_min, temperature_max, humidity_min, humidity_max, hazardous_class, precautions, env_parameters
) VALUES
('MAT-2024-0001', 5, 35, 20, 70, 'NON-HAZ', 'Keep away from direct sunlight', 'Store in cool, dry place');

-- Seed packaging hierarchy ITEM -> CARTON(12) -> BOX(4) -> PALLET(50) -> CONTAINER(20)
INSERT OR IGNORE INTO packaging_hierarchy (id, name, activation_from, packaging_capacity_constraints, gtin_assignment_format, description)
VALUES (1, 'Standard Shampoo 100ml', '2024-01-01', 0, 'GTIN-14', 'Default packaging config');

DELETE FROM packaging_level WHERE hierarchy_id = 1;
INSERT INTO packaging_level (
  hierarchy_id, level_index, level_code, level_name, contained_quantity, id_tech, barcode_type, rfid_tag_type, epc_format, label_template, gtin_format, default_label_copies, is_returnable, is_serialized
) VALUES
(1,1,'L1','ITEM',1,'BARCODE','EAN-13',NULL,NULL,'ITEM_LABEL','GTIN-13',1,0,0),
(1,2,'L2','CARTON',12,'BARCODE','GS1-128',NULL,NULL,'CARTON_LABEL','GTIN-14',2,0,0),
(1,3,'L3','BOX',4,'BARCODE','GS1-128',NULL,NULL,'BOX_LABEL','GTIN-14',2,0,0),
(1,4,'L4','PALLET',50,'RFID',NULL,'UHF','SGTIN-96','PALLET_LABEL','SSCC',2,1,0),
(1,5,'L5','CONTAINER',20,'RFID',NULL,'UHF','SGLN-96','CONTAINER_LABEL','SGLN',2,1,0);
