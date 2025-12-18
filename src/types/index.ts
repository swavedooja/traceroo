// Type definitions for TraceRoo application

export type UserRole = 'Administrator' | 'Packing Team' | 'Logistics Team' | 'Goods Handling Team' | 'Customer';

export type AssetStatus = 'in_stock' | 'scrapped' | 'damaged' | 'expired' | 'in_transit' | 'delivered';

export type ConsignmentStatus = 'planned' | 'in_transit' | 'delivered';

export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LocationType {
  id: string;
  name: string;
  parent_location_type_id: string | null;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  location_type_id: string;
  parent_location_id: string | null;
  location_qr_data: string;
  created_at: string;
}

export interface Device {
  id: string;
  device_identifier: string;
  device_name: string | null;
  assigned_location_id: string;
  last_logged_in_user_id: string | null;
  created_at: string;
}

export interface LabelTemplate {
  id: string;
  template_name: string;
  asset_type_id: string;
  config_json: string;
  created_at: string;
}

export interface LabelTemplateConfig {
  showName: boolean;
  showSKU: boolean;
  showMfgDate: boolean;
  showExpiryDate: boolean;
  showBarcode: boolean;
}

export interface PackingTemplate {
  id: string;
  template_name: string;
  hierarchy_json: string;
  created_at: string;
}

export interface AssetType {
  id: string;
  name: string;
  created_at: string;
}

export interface Asset {
  id: string;
  barcode_data: string;
  asset_type_id: string;
  name: string | null;
  description: string | null;
  sku: string | null;
  mfg_date: string | null;
  expiry_date: string | null;
  status: AssetStatus;
  status_reason: string | null;
  status_changed_at: string | null;
  current_owner_id: string | null;
  current_location_id: string | null;
  parent_asset_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consignment {
  id: string;
  consignment_number: string;
  status: ConsignmentStatus;
  destination_location_id: string | null;
  recipient_customer_id: string | null;
  created_by_user_id: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface ConsignmentAsset {
  id: string;
  consignment_id: string;
  asset_id: string;
  created_at: string;
}

export interface OwnershipHistory {
  id: string;
  asset_id: string;
  previous_owner_id: string | null;
  new_owner_id: string;
  changed_by_user_id: string;
  changed_at: string;
}

export interface LocationHistory {
  id: string;
  asset_id: string;
  previous_location_id: string | null;
  new_location_id: string;
  scanned_by_user_id: string;
  scanned_at: string;
}

export interface AssetStatusHistory {
  id: string;
  asset_id: string;
  previous_status: AssetStatus | null;
  new_status: AssetStatus;
  reason: string | null;
  changed_by_user_id: string;
  changed_at: string;
}

// Extended types with joined data
export interface AssetWithDetails extends Asset {
  asset_type_name?: string;
  owner_username?: string;
  location_name?: string;
  parent_asset_name?: string;
}

export interface ConsignmentWithDetails extends Consignment {
  destination_location_name?: string;
  recipient_customer_username?: string;
  created_by_username?: string;
  asset_count?: number;
}

// Fixed Asset Specific Types
export type PhysicalCondition = 'operational' | 'idle' | 'damaged' | 'missing';
export type FixedAssetStatus = 'verified' | 'unverified' | 'scrapped';

export interface FixedAsset {
  id: string;
  asset_code: string;
  barcode_data: string | null;
  name: string;
  description: string | null;
  asset_type_id: string;
  location_id: string;
  cost: number | null;
  acquisition_date: string | null;
  capitalization_date: string | null;
  useful_life: number | null;
  depreciation_rate: number | null;
  physical_condition: PhysicalCondition | null;
  status: FixedAssetStatus;
  photographic_evidence: string | null;
  last_verified_at: string | null;
  last_verified_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FixedAssetWithDetails extends FixedAsset {
  asset_type_name?: string;
  location_name?: string;
  department?: string;
  verified_by_username?: string;
}

export interface FixedAssetType {
  id: string;
  name: string;
  created_at: string;
}

export interface FixedAssetLocation {
  id: string;
  name: string;
  department: string | null;
  location_qr_data: string | null;
  created_at: string;
}