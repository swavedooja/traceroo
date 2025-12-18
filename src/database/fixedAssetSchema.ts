// Database schema specifically for Vedanta Fixed Asset Tracking
export const createFixedAssetTablesSQL = `
-- Fixed Assets table with Vedanta specific requirements
CREATE TABLE IF NOT EXISTS FixedAssets (
  id TEXT PRIMARY KEY,
  asset_code TEXT UNIQUE NOT NULL, -- Unique identification number
  barcode_data TEXT UNIQUE, -- RFID / QR / Barcode data
  name TEXT NOT NULL, -- description
  description TEXT, -- additional tech specs (Model, Serial, etc)
  asset_type_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  cost REAL, -- asset value
  acquisition_date TEXT,
  capitalization_date TEXT,
  useful_life REAL,
  depreciation_rate REAL,
  physical_condition TEXT CHECK(physical_condition IN ('operational', 'idle', 'damaged', 'missing')),
  status TEXT NOT NULL DEFAULT 'verified',
  photographic_evidence TEXT, -- local path or URI
  last_verified_at TEXT,
  last_verified_by_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_type_id) REFERENCES FixedAssetTypes(id),
  FOREIGN KEY (location_id) REFERENCES FixedAssetLocations(id),
  FOREIGN KEY (last_verified_by_id) REFERENCES Users(id)
);

-- Types of fixed assets (e.g., Air Conditioner, Exhaust, Machine, Vehicle)
CREATE TABLE IF NOT EXISTS FixedAssetTypes (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Plant/Site locations for Vedanta
CREATE TABLE IF NOT EXISTS FixedAssetLocations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- Jharsuguda, Lanigarh, Kakinada, Bhubaneswar, Mines etc.
  department TEXT,
  location_qr_data TEXT UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Audit trail for fixed asset movement
CREATE TABLE IF NOT EXISTS FixedAssetLocationHistory (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  previous_location_id TEXT,
  new_location_id TEXT NOT NULL,
  scanned_by_user_id TEXT NOT NULL,
  scanned_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (asset_id) REFERENCES FixedAssets(id),
  FOREIGN KEY (previous_location_id) REFERENCES FixedAssetLocations(id),
  FOREIGN KEY (new_location_id) REFERENCES FixedAssetLocations(id),
  FOREIGN KEY (scanned_by_user_id) REFERENCES Users(id)
);

-- Audit trail for physical condition changes
CREATE TABLE IF NOT EXISTS FixedAssetConditionHistory (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  previous_condition TEXT,
  new_condition TEXT NOT NULL,
  remarks TEXT,
  changed_by_user_id TEXT NOT NULL,
  changed_at TEXT DEFAULT (datetime('now')),
  photographic_evidence TEXT,
  FOREIGN KEY (asset_id) REFERENCES FixedAssets(id),
  FOREIGN KEY (changed_by_user_id) REFERENCES Users(id)
);
`;
