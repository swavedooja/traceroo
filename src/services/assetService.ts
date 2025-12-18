import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import type { Asset, AssetWithDetails, AssetStatus, AssetType, AssetStatusHistory, LocationHistory, OwnershipHistory } from '../types';

export const assetService = {
  async getAssetByBarcode(barcodeData: string): Promise<AssetWithDetails | null> {
    const db = getDatabase();
    const query = `
      SELECT 
        a.*,
        at.name as asset_type_name,
        u.username as owner_username,
        l.name as location_name,
        pa.name as parent_asset_name
      FROM Assets a
      LEFT JOIN AssetTypes at ON a.asset_type_id = at.id
      LEFT JOIN Users u ON a.current_owner_id = u.id
      LEFT JOIN Locations l ON a.current_location_id = l.id
      LEFT JOIN Assets pa ON a.parent_asset_id = pa.id
      WHERE a.barcode_data = ?
    `;
    return await db.getFirstAsync<AssetWithDetails>(query, [barcodeData]);
  },

  async getAssetById(id: string): Promise<AssetWithDetails | null> {
    const db = getDatabase();
    const query = `
      SELECT 
        a.*,
        at.name as asset_type_name,
        u.username as owner_username,
        l.name as location_name,
        pa.name as parent_asset_name
      FROM Assets a
      LEFT JOIN AssetTypes at ON a.asset_type_id = at.id
      LEFT JOIN Users u ON a.current_owner_id = u.id
      LEFT JOIN Locations l ON a.current_location_id = l.id
      LEFT JOIN Assets pa ON a.parent_asset_id = pa.id
      WHERE a.id = ?
    `;
    return await db.getFirstAsync<AssetWithDetails>(query, [id]);
  },

  async createAsset(
    barcodeData: string,
    assetTypeId: string,
    name?: string,
    description?: string,
    sku?: string,
    mfgDate?: string,
    expiryDate?: string
  ): Promise<Asset> {
    const db = getDatabase();
    const id = await generateUUID();

    await db.runAsync(
      `INSERT INTO Assets (id, barcode_data, asset_type_id, name, description, sku, mfg_date, expiry_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, barcodeData, assetTypeId, name || null, description || null, sku || null, mfgDate || null, expiryDate || null]
    );

    const asset = await db.getFirstAsync<Asset>('SELECT * FROM Assets WHERE id = ?', [id]);
    if (!asset) {
      throw new Error('Failed to create asset');
    }

    return asset;
  },

  async updateAssetParent(assetId: string, parentAssetId: string | null): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE Assets SET parent_asset_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [parentAssetId, assetId]
    );
  },

  async updateAssetLocation(assetId: string, newLocationId: string, scannedByUserId: string): Promise<void> {
    const db = getDatabase();
    
    // Get current location
    const asset = await db.getFirstAsync<Asset>('SELECT current_location_id FROM Assets WHERE id = ?', [assetId]);
    const previousLocationId = asset?.current_location_id || null;

    // Update asset location
    await db.runAsync(
      'UPDATE Assets SET current_location_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newLocationId, assetId]
    );

    // Log in history
    const historyId = await generateUUID();
    await db.runAsync(
      'INSERT INTO LocationHistory (id, asset_id, previous_location_id, new_location_id, scanned_by_user_id) VALUES (?, ?, ?, ?, ?)',
      [historyId, assetId, previousLocationId, newLocationId, scannedByUserId]
    );
  },

  async updateAssetOwner(assetId: string, newOwnerId: string, changedByUserId: string): Promise<void> {
    const db = getDatabase();
    
    // Get current owner
    const asset = await db.getFirstAsync<Asset>('SELECT current_owner_id FROM Assets WHERE id = ?', [assetId]);
    const previousOwnerId = asset?.current_owner_id || null;

    // Update asset owner
    await db.runAsync(
      'UPDATE Assets SET current_owner_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newOwnerId, assetId]
    );

    // Log in history
    const historyId = await generateUUID();
    await db.runAsync(
      'INSERT INTO OwnershipHistory (id, asset_id, previous_owner_id, new_owner_id, changed_by_user_id) VALUES (?, ?, ?, ?, ?)',
      [historyId, assetId, previousOwnerId, newOwnerId, changedByUserId]
    );
  },

  async updateAssetStatus(assetId: string, newStatus: AssetStatus, reason: string | null, changedByUserId: string): Promise<void> {
    const db = getDatabase();
    
    // Get current status
    const asset = await db.getFirstAsync<Asset>('SELECT status FROM Assets WHERE id = ?', [assetId]);
    const previousStatus = asset?.status || null;

    // Update asset status
    await db.runAsync(
      'UPDATE Assets SET status = ?, status_reason = ?, status_changed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, reason, assetId]
    );

    // Log in history
    const historyId = await generateUUID();
    await db.runAsync(
      'INSERT INTO AssetStatusHistory (id, asset_id, previous_status, new_status, reason, changed_by_user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [historyId, assetId, previousStatus, newStatus, reason, changedByUserId]
    );
  },

  async getAssetChildren(parentAssetId: string): Promise<AssetWithDetails[]> {
    const db = getDatabase();
    const query = `
      SELECT 
        a.*,
        at.name as asset_type_name,
        u.username as owner_username,
        l.name as location_name
      FROM Assets a
      LEFT JOIN AssetTypes at ON a.asset_type_id = at.id
      LEFT JOIN Users u ON a.current_owner_id = u.id
      LEFT JOIN Locations l ON a.current_location_id = l.id
      WHERE a.parent_asset_id = ?
      ORDER BY a.created_at DESC
    `;
    return await db.getAllAsync<AssetWithDetails>(query, [parentAssetId]);
  },

  async getAssetLocationHistory(assetId: string): Promise<LocationHistory[]> {
    const db = getDatabase();
    return await db.getAllAsync<LocationHistory>(
      'SELECT * FROM LocationHistory WHERE asset_id = ? ORDER BY scanned_at DESC',
      [assetId]
    );
  },

  async getAssetOwnershipHistory(assetId: string): Promise<OwnershipHistory[]> {
    const db = getDatabase();
    return await db.getAllAsync<OwnershipHistory>(
      'SELECT * FROM OwnershipHistory WHERE asset_id = ? ORDER BY changed_at DESC',
      [assetId]
    );
  },

  async getAssetStatusHistory(assetId: string): Promise<AssetStatusHistory[]> {
    const db = getDatabase();
    return await db.getAllAsync<AssetStatusHistory>(
      'SELECT * FROM AssetStatusHistory WHERE asset_id = ? ORDER BY changed_at DESC',
      [assetId]
    );
  },

  async getAllAssets(): Promise<AssetWithDetails[]> {
    const db = getDatabase();
    const query = `
      SELECT 
        a.*,
        at.name as asset_type_name,
        u.username as owner_username,
        l.name as location_name
      FROM Assets a
      LEFT JOIN AssetTypes at ON a.asset_type_id = at.id
      LEFT JOIN Users u ON a.current_owner_id = u.id
      LEFT JOIN Locations l ON a.current_location_id = l.id
      ORDER BY a.created_at DESC
    `;
    return await db.getAllAsync<AssetWithDetails>(query);
  },

  async getAssetsByOwner(ownerId: string): Promise<AssetWithDetails[]> {
    const db = getDatabase();
    const query = `
      SELECT 
        a.*,
        at.name as asset_type_name,
        u.username as owner_username,
        l.name as location_name
      FROM Assets a
      LEFT JOIN AssetTypes at ON a.asset_type_id = at.id
      LEFT JOIN Users u ON a.current_owner_id = u.id
      LEFT JOIN Locations l ON a.current_location_id = l.id
      WHERE a.current_owner_id = ?
      ORDER BY a.created_at DESC
    `;
    return await db.getAllAsync<AssetWithDetails>(query, [ownerId]);
  },

  // Asset Types
  async getAllAssetTypes(): Promise<AssetType[]> {
    const db = getDatabase();
    return await db.getAllAsync<AssetType>('SELECT * FROM AssetTypes ORDER BY name');
  },

  async createAssetType(name: string): Promise<AssetType> {
    const db = getDatabase();
    const id = await generateUUID();

    await db.runAsync(
      'INSERT INTO AssetTypes (id, name) VALUES (?, ?)',
      [id, name]
    );

    const assetType = await db.getFirstAsync<AssetType>(
      'SELECT * FROM AssetTypes WHERE id = ?',
      [id]
    );

    if (!assetType) {
      throw new Error('Failed to create asset type');
    }

    return assetType;
  },
};