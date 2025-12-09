-- Dummy Data for TraceRoo

-- 1. Master Definitions
INSERT INTO master_definitions (def_type, def_value, description) VALUES 
('MATERIAL_TYPE', 'RAW', 'Raw Material'),
('MATERIAL_TYPE', 'SEMI', 'Semi-Finished Goods'),
('MATERIAL_TYPE', 'FIN', 'Finished Goods'),
('MATERIAL_CAT', 'ELECTRONICS', 'Electronic Components'),
('MATERIAL_CAT', 'MECHANICAL', 'Mechanical Parts'),
('MATERIAL_CAT', 'CHEMICAL', 'Chemicals and Fluids'),
('LOCATION_TYPE', 'WAREHOUSE', 'Main Warehouse Building'),
('LOCATION_TYPE', 'ZONE', 'Specific Zone within Warehouse'),
('LOCATION_TYPE', 'RACK', 'Storage Rack'),
('LOCATION_TYPE', 'BIN', 'Specific Bin Location'),
('LOCATION_TYPE', 'VEHICLE', 'Transport Vehicle'),
('LOCATION_CAT', 'GENERAL', 'General Storage'),
('LOCATION_CAT', 'COLD_CHAIN', 'Temperature Controlled'),
('LOCATION_CAT', 'HAZMAT', 'Hazardous Materials Area');

-- 2. Locations
-- Root: Main Warehouse
INSERT INTO locations (id, code, name, type, category, address_line1, city, country, status) VALUES 
('L001', 'WH-MAIN-001', 'Central Warehouse', 'WAREHOUSE', 'GENERAL', '123 Logistics Way', 'New York', 'USA', 'ACTIVE');

-- Zone A (under Main Warehouse)
INSERT INTO locations (id, code, name, type, category, parent_id, status) VALUES 
('L002', 'ZN-A', 'Zone A - Electronics', 'ZONE', 'GENERAL', 'L001', 'ACTIVE');

-- Rack 01 (under Zone A)
INSERT INTO locations (id, code, name, type, category, parent_id, status) VALUES 
('L003', 'RK-A-01', 'Rack 01', 'RACK', 'GENERAL', 'L002', 'ACTIVE');

-- Bin 01-A (under Rack 01)
INSERT INTO locations (id, code, name, type, category, parent_id, gln, status) VALUES 
('L004', 'BN-A-01-A', 'Bin 01-Level A', 'BIN', 'GENERAL', 'L003', '1234567890123', 'ACTIVE');

-- 3. Materials
INSERT INTO materials (id, code, name, type, category, base_uom, is_serial_managed, is_batch_managed, min_stock, gross_weight, weight_uom) VALUES 
('M001', 'MAT-PCB-001', 'Main Control PCB', 'RAW', 'ELECTRONICS', 'EA', 1, 1, 100, 0.2, 'KG'),
('M002', 'MAT-CH-005', 'Cooling Fluid X', 'RAW', 'CHEMICAL', 'L', 0, 1, 500, 1.1, 'KG'),
('M003', 'PROD-SMART-V1', 'Smart Meter V1', 'FIN', 'ELECTRONICS', 'EA', 1, 0, 50, 2.5, 'KG');

-- 4. Inventory (Optional dummy data)
INSERT INTO inventory (material_id, serial_number, batch_number, status, location_id) VALUES
('M001', 'SN-PCB-001', 'BATCH-001', 'REGISTERED', 'L004');
