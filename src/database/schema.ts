// Database schema SQL statements for TraceRoo

export const createTablesSQL = `
-- Users of the application
CREATE TABLE IF NOT EXISTS Users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Administrator', 'Packing Team', 'Logistics Team', 'Goods Handling Team', 'Customer')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Defines the hierarchy of location types
CREATE TABLE IF NOT EXISTS LocationTypes (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  parent_location_type_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (parent_location_type_id) REFERENCES LocationTypes(id)
);

-- Physical locations where assets are stored
CREATE TABLE IF NOT EXISTS Locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location_type_id TEXT NOT NULL,
  parent_location_id TEXT,
  location_qr_data TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (location_type_id) REFERENCES LocationTypes(id),
  FOREIGN KEY (parent_location_id) REFERENCES Locations(id)
);

-- Registered mobile devices
CREATE TABLE IF NOT EXISTS Devices (
  id TEXT PRIMARY KEY,
  device_identifier TEXT UNIQUE NOT NULL,
  device_name TEXT,
  assigned_location_id TEXT NOT NULL,
  last_logged_in_user_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (assigned_location_id) REFERENCES Locations(id),
  FOREIGN KEY (last_logged_in_user_id) REFERENCES Users(id)
);

-- Templates for designing labels
CREATE TABLE IF NOT EXISTS LabelTemplates (
  id TEXT PRIMARY KEY,
  template_name TEXT UNIQUE NOT NULL,
  asset_type_id TEXT NOT NULL,
  config_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_type_id) REFERENCES AssetTypes(id)
);

-- Defines the packaging hierarchy
CREATE TABLE IF NOT EXISTS PackingTemplates (
  id TEXT PRIMARY KEY,
  template_name TEXT UNIQUE NOT NULL,
  hierarchy_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Types of assets
CREATE TABLE IF NOT EXISTS AssetTypes (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Central table for every tracked item
CREATE TABLE IF NOT EXISTS Assets (
  id TEXT PRIMARY KEY,
  barcode_data TEXT UNIQUE NOT NULL,
  asset_type_id TEXT NOT NULL,
  name TEXT,
  description TEXT,
  sku TEXT,
  mfg_date TEXT,
  expiry_date TEXT,
  status TEXT NOT NULL DEFAULT 'in_stock',
  status_reason TEXT,
  status_changed_at TEXT,
  current_owner_id TEXT,
  current_location_id TEXT,
  parent_asset_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_type_id) REFERENCES AssetTypes(id),
  FOREIGN KEY (current_owner_id) REFERENCES Users(id),
  FOREIGN KEY (current_location_id) REFERENCES Locations(id),
  FOREIGN KEY (parent_asset_id) REFERENCES Assets(id)
);

-- Shipment consignments
CREATE TABLE IF NOT EXISTS Consignments (
  id TEXT PRIMARY KEY,
  consignment_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  destination_location_id TEXT,
  recipient_customer_id TEXT,
  created_by_user_id TEXT,
  delivered_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (destination_location_id) REFERENCES Locations(id),
  FOREIGN KEY (recipient_customer_id) REFERENCES Users(id),
  FOREIGN KEY (created_by_user_id) REFERENCES Users(id)
);

-- Join table for assets within a consignment
CREATE TABLE IF NOT EXISTS ConsignmentAssets (
  id TEXT PRIMARY KEY,
  consignment_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (consignment_id) REFERENCES Consignments(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES Assets(id) ON DELETE CASCADE
);

-- Audit trail for ownership changes
CREATE TABLE IF NOT EXISTS OwnershipHistory (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  previous_owner_id TEXT,
  new_owner_id TEXT NOT NULL,
  changed_by_user_id TEXT NOT NULL,
  changed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_id) REFERENCES Assets(id),
  FOREIGN KEY (previous_owner_id) REFERENCES Users(id),
  FOREIGN KEY (new_owner_id) REFERENCES Users(id),
  FOREIGN KEY (changed_by_user_id) REFERENCES Users(id)
);

-- Audit trail for location changes
CREATE TABLE IF NOT EXISTS LocationHistory (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  previous_location_id TEXT,
  new_location_id TEXT NOT NULL,
  scanned_by_user_id TEXT NOT NULL,
  scanned_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_id) REFERENCES Assets(id),
  FOREIGN KEY (previous_location_id) REFERENCES Locations(id),
  FOREIGN KEY (new_location_id) REFERENCES Locations(id),
  FOREIGN KEY (scanned_by_user_id) REFERENCES Users(id)
);

-- Audit trail for asset status changes
CREATE TABLE IF NOT EXISTS AssetStatusHistory (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  changed_by_user_id TEXT NOT NULL,
  changed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_id) REFERENCES Assets(id),
  FOREIGN KEY (changed_by_user_id) REFERENCES Users(id)
);
`;