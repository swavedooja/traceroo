-- SQLite Schema for TraceRoo
-- Overhauled for Asset Track & Trace

-- 1. Master Definitions (Generic Configuration)
CREATE TABLE IF NOT EXISTS master_definitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    def_type TEXT NOT NULL,
    def_value TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    UNIQUE(def_type, def_value)
);

-- 2. Locations
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY, -- UUID
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    category TEXT,
    parent_id TEXT,
    status TEXT DEFAULT 'ACTIVE',
    
    address_line1 TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    
    capacity_volume REAL,
    capacity_weight REAL,
    current_utilization REAL,
    
    gln TEXT,
    rfid_reader_id TEXT,
    is_quarantine INTEGER DEFAULT 0,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES locations(id)
);

-- 3. Materials
CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY, -- UUID
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    type TEXT,
    category TEXT,
    status TEXT,
    base_uom TEXT,
    
    is_batch_managed INTEGER DEFAULT 0,
    is_serial_managed INTEGER DEFAULT 0,
    shelf_life_days INTEGER,
    min_stock REAL,
    max_stock REAL,
    
    gross_weight REAL,
    net_weight REAL,
    weight_uom TEXT,
    length REAL,
    width REAL,
    height REAL,
    dimension_uom TEXT,
    volume REAL,
    volume_uom TEXT,
    
    is_hazmat INTEGER DEFAULT 0,
    hazmat_class TEXT,
    un_number TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Handling Parameters
CREATE TABLE IF NOT EXISTS handling_parameter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id TEXT,
    temperature_min REAL,
    temperature_max REAL,
    humidity_min REAL,
    humidity_max REAL,
    hazardous_class TEXT,
    precautions TEXT,
    env_parameters TEXT,
    epc_format TEXT,
    FOREIGN KEY(material_id) REFERENCES materials(id)
);

-- 5. Material Images
CREATE TABLE IF NOT EXISTS material_image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id TEXT,
    type TEXT,
    filename TEXT,
    url TEXT,
    FOREIGN KEY(material_id) REFERENCES materials(id)
);

-- 6. Material Documents
CREATE TABLE IF NOT EXISTS material_document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id TEXT,
    doc_type TEXT,
    filename TEXT,
    url TEXT,
    FOREIGN KEY(material_id) REFERENCES materials(id)
);

-- 7. Packaging Hierarchy
CREATE TABLE IF NOT EXISTS packaging_hierarchy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    activation_from DATE,
    activation_to DATE,
    packaging_capacity_constraints INTEGER,
    gtin_assignment_format TEXT,
    description TEXT
);

-- 8. Packaging Levels
CREATE TABLE IF NOT EXISTS packaging_level (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hierarchy_id INTEGER,
    level_index INTEGER,
    level_code TEXT,
    level_name TEXT,
    contained_quantity INTEGER,
    dimensionsmm TEXT,
    weight_kg REAL,
    capacity_units TEXT,
    id_tech TEXT,
    barcode_type TEXT,
    rfid_tag_type TEXT,
    epc_format TEXT,
    label_template TEXT,
    gtin_format TEXT,
    default_label_copies INTEGER,
    is_returnable INTEGER,
    is_serialized INTEGER,
    FOREIGN KEY(hierarchy_id) REFERENCES packaging_hierarchy(id)
);

-- 9. Container Units (Abstract Base + Joined Tables)
CREATE TABLE IF NOT EXISTS container_unit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serial_number TEXT UNIQUE NOT NULL,
    status TEXT,
    location_id TEXT,
    parent_container_id INTEGER,
    FOREIGN KEY(location_id) REFERENCES locations(id),
    FOREIGN KEY(parent_container_id) REFERENCES container_unit(id)
);

CREATE TABLE IF NOT EXISTS box (
    id INTEGER PRIMARY KEY,
    batch_number TEXT,
    item_count INTEGER,
    FOREIGN KEY(id) REFERENCES container_unit(id)
);

CREATE TABLE IF NOT EXISTS pallet (
    id INTEGER PRIMARY KEY,
    box_count INTEGER,
    FOREIGN KEY(id) REFERENCES container_unit(id)
);

CREATE TABLE IF NOT EXISTS shipping_container (
    id INTEGER PRIMARY KEY,
    container_number TEXT,
    seal_number TEXT,
    FOREIGN KEY(id) REFERENCES container_unit(id)
);

-- 10. Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id TEXT NOT NULL,
    serial_number TEXT UNIQUE,
    batch_number TEXT,
    status TEXT,
    location_id TEXT,
    box_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(material_id) REFERENCES materials(id),
    FOREIGN KEY(location_id) REFERENCES locations(id),
    FOREIGN KEY(box_id) REFERENCES box(id)
);

-- 11. Label Templates
CREATE TABLE IF NOT EXISTS label_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    zpl_content TEXT,
    material_id TEXT,
    is_default INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(material_id) REFERENCES materials(id)
);

-- 12. Trace Events
CREATE TABLE IF NOT EXISTS trace_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    location TEXT,
    user TEXT,
    notes TEXT,
    status TEXT,
    inventory_id INTEGER,
    container_id INTEGER,
    FOREIGN KEY(inventory_id) REFERENCES inventory(id),
    FOREIGN KEY(container_id) REFERENCES container_unit(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
CREATE INDEX IF NOT EXISTS idx_inventory_material ON inventory(material_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location_id);
