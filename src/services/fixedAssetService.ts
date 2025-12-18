import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import type {
    FixedAsset,
    FixedAssetWithDetails,
    FixedAssetType,
    FixedAssetLocation,
    PhysicalCondition
} from '../types';

export const fixedAssetService = {
    async getAllFixedAssets(): Promise<FixedAssetWithDetails[]> {
        const db = getDatabase();
        const query = `
      SELECT 
        fa.*,
        fat.name as asset_type_name,
        fal.name as location_name,
        fal.department,
        u.username as verified_by_username
      FROM FixedAssets fa
      LEFT JOIN FixedAssetTypes fat ON fa.asset_type_id = fat.id
      LEFT JOIN FixedAssetLocations fal ON fa.location_id = fal.id
      LEFT JOIN Users u ON fa.last_verified_by_id = u.id
      ORDER BY fa.asset_code ASC
    `;
        return await db.getAllAsync<FixedAssetWithDetails>(query);
    },

    async getFixedAssetById(id: string): Promise<FixedAssetWithDetails | null> {
        const db = getDatabase();
        const query = `
      SELECT 
        fa.*,
        fat.name as asset_type_name,
        fal.name as location_name,
        fal.department,
        u.username as verified_by_username
      FROM FixedAssets fa
      LEFT JOIN FixedAssetTypes fat ON fa.asset_type_id = fat.id
      LEFT JOIN FixedAssetLocations fal ON fa.location_id = fal.id
      LEFT JOIN Users u ON fa.last_verified_by_id = u.id
      WHERE fa.id = ?
    `;
        return await db.getFirstAsync<FixedAssetWithDetails>(query, [id]);
    },

    async getFixedAssetByCode(assetCode: string): Promise<FixedAssetWithDetails | null> {
        const db = getDatabase();
        const query = `
      SELECT 
        fa.*,
        fat.name as asset_type_name,
        fal.name as location_name,
        fal.department,
        u.username as verified_by_username
      FROM FixedAssets fa
      LEFT JOIN FixedAssetTypes fat ON fa.asset_type_id = fat.id
      LEFT JOIN FixedAssetLocations fal ON fa.location_id = fal.id
      LEFT JOIN Users u ON fa.last_verified_by_id = u.id
      WHERE fa.asset_code = ?
    `;
        return await db.getFirstAsync<FixedAssetWithDetails>(query, [assetCode]);
    },

    async createFixedAsset(asset: Partial<FixedAsset>): Promise<string> {
        const db = getDatabase();
        const id = await generateUUID();

        await db.runAsync(
            `INSERT INTO FixedAssets (
        id, asset_code, barcode_data, name, description, asset_type_id, 
        location_id, cost, acquisition_date, capitalization_date, 
        useful_life, depreciation_rate, physical_condition, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, asset.asset_code, asset.barcode_data || null, asset.name,
                asset.description || null, asset.asset_type_id, asset.location_id,
                asset.cost || null, asset.acquisition_date || null,
                asset.capitalization_date || null, asset.useful_life || null,
                asset.depreciation_rate || null, asset.physical_condition || 'operational',
                asset.status || 'verified'
            ]
        );
        return id;
    },

    async updatePhysicalVerification(
        assetId: string,
        condition: PhysicalCondition,
        userId: string,
        remarks?: string,
        photoUri?: string
    ): Promise<void> {
        const db = getDatabase();
        const now = new Date().toISOString();

        await db.runAsync(
            `UPDATE FixedAssets 
       SET physical_condition = ?, 
           last_verified_at = ?, 
           last_verified_by_id = ?, 
           photographic_evidence = ?, 
           updated_at = ? 
       WHERE id = ?`,
            [condition, now, userId, photoUri || null, now, assetId]
        );

        // Add to history
        const historyId = await generateUUID();
        await db.runAsync(
            `INSERT INTO FixedAssetConditionHistory (
        id, asset_id, new_condition, remarks, changed_by_user_id, changed_at, photographic_evidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [historyId, assetId, condition, remarks || null, userId, now, photoUri || null]
        );
    },

    async getExceptionAssets(): Promise<FixedAssetWithDetails[]> {
        const db = getDatabase();
        const query = `
      SELECT 
        fa.*,
        fat.name as asset_type_name,
        fal.name as location_name,
        fal.department
      FROM FixedAssets fa
      LEFT JOIN FixedAssetTypes fat ON fa.asset_type_id = fat.id
      LEFT JOIN FixedAssetLocations fal ON fa.location_id = fal.id
      WHERE fa.physical_condition IN ('damaged', 'missing', 'idle')
      ORDER BY fa.physical_condition DESC
    `;
        return await db.getAllAsync<FixedAssetWithDetails>(query);
    },

    async getAllAssetTypes(): Promise<FixedAssetType[]> {
        const db = getDatabase();
        return await db.getAllAsync<FixedAssetType>('SELECT * FROM FixedAssetTypes ORDER BY name');
    },

    async getAllLocations(): Promise<FixedAssetLocation[]> {
        const db = getDatabase();
        return await db.getAllAsync<FixedAssetLocation>('SELECT * FROM FixedAssetLocations ORDER BY name');
    }
};
