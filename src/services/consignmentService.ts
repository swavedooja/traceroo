import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import type { Consignment, ConsignmentWithDetails, ConsignmentAsset, ConsignmentStatus } from '../types';

export const consignmentService = {
  async createConsignment(
    consignmentNumber: string,
    destinationLocationId: string | null,
    recipientCustomerId: string | null,
    createdByUserId: string
  ): Promise<Consignment> {
    const db = getDatabase();
    const id = await generateUUID();

    await db.runAsync(
      'INSERT INTO Consignments (id, consignment_number, destination_location_id, recipient_customer_id, created_by_user_id) VALUES (?, ?, ?, ?, ?)',
      [id, consignmentNumber, destinationLocationId, recipientCustomerId, createdByUserId]
    );

    const consignment = await db.getFirstAsync<Consignment>(
      'SELECT * FROM Consignments WHERE id = ?',
      [id]
    );

    if (!consignment) {
      throw new Error('Failed to create consignment');
    }

    return consignment;
  },

  async getConsignmentById(id: string): Promise<ConsignmentWithDetails | null> {
    const db = getDatabase();
    const query = `
      SELECT 
        c.*,
        l.name as destination_location_name,
        u1.username as recipient_customer_username,
        u2.username as created_by_username,
        COUNT(ca.id) as asset_count
      FROM Consignments c
      LEFT JOIN Locations l ON c.destination_location_id = l.id
      LEFT JOIN Users u1 ON c.recipient_customer_id = u1.id
      LEFT JOIN Users u2 ON c.created_by_user_id = u2.id
      LEFT JOIN ConsignmentAssets ca ON c.id = ca.consignment_id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    return await db.getFirstAsync<ConsignmentWithDetails>(query, [id]);
  },

  async getAllConsignments(): Promise<ConsignmentWithDetails[]> {
    const db = getDatabase();
    const query = `
      SELECT 
        c.*,
        l.name as destination_location_name,
        u1.username as recipient_customer_username,
        u2.username as created_by_username,
        COUNT(ca.id) as asset_count
      FROM Consignments c
      LEFT JOIN Locations l ON c.destination_location_id = l.id
      LEFT JOIN Users u1 ON c.recipient_customer_id = u1.id
      LEFT JOIN Users u2 ON c.created_by_user_id = u2.id
      LEFT JOIN ConsignmentAssets ca ON c.id = ca.consignment_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return await db.getAllAsync<ConsignmentWithDetails>(query);
  },

  async getConsignmentsByCustomer(customerId: string): Promise<ConsignmentWithDetails[]> {
    const db = getDatabase();
    const query = `
      SELECT 
        c.*,
        l.name as destination_location_name,
        u1.username as recipient_customer_username,
        u2.username as created_by_username,
        COUNT(ca.id) as asset_count
      FROM Consignments c
      LEFT JOIN Locations l ON c.destination_location_id = l.id
      LEFT JOIN Users u1 ON c.recipient_customer_id = u1.id
      LEFT JOIN Users u2 ON c.created_by_user_id = u2.id
      LEFT JOIN ConsignmentAssets ca ON c.id = ca.consignment_id
      WHERE c.recipient_customer_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return await db.getAllAsync<ConsignmentWithDetails>(query, [customerId]);
  },

  async updateConsignmentStatus(id: string, status: ConsignmentStatus): Promise<void> {
    const db = getDatabase();
    const updates: any[] = [status];
    let query = 'UPDATE Consignments SET status = ?';

    if (status === 'delivered') {
      query += ', delivered_at = CURRENT_TIMESTAMP';
    }

    query += ' WHERE id = ?';
    updates.push(id);

    await db.runAsync(query, updates);
  },

  async addAssetToConsignment(consignmentId: string, assetId: string): Promise<void> {
    const db = getDatabase();
    const id = await generateUUID();

    await db.runAsync(
      'INSERT INTO ConsignmentAssets (id, consignment_id, asset_id) VALUES (?, ?, ?)',
      [id, consignmentId, assetId]
    );

    // Update asset status to in_transit
    await db.runAsync(
      'UPDATE Assets SET status = ? WHERE id = ?',
      ['in_transit', assetId]
    );
  },

  async removeAssetFromConsignment(consignmentId: string, assetId: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'DELETE FROM ConsignmentAssets WHERE consignment_id = ? AND asset_id = ?',
      [consignmentId, assetId]
    );

    // Update asset status back to in_stock
    await db.runAsync(
      'UPDATE Assets SET status = ? WHERE id = ?',
      ['in_stock', assetId]
    );
  },

  async getConsignmentAssets(consignmentId: string): Promise<any[]> {
    const db = getDatabase();
    const query = `
      SELECT 
        a.*,
        at.name as asset_type_name
      FROM ConsignmentAssets ca
      JOIN Assets a ON ca.asset_id = a.id
      LEFT JOIN AssetTypes at ON a.asset_type_id = at.id
      WHERE ca.consignment_id = ?
      ORDER BY ca.created_at DESC
    `;
    return await db.getAllAsync(query, [consignmentId]);
  },

  async deleteConsignment(id: string): Promise<void> {
    const db = getDatabase();
    // ConsignmentAssets will be deleted automatically due to CASCADE
    await db.runAsync('DELETE FROM Consignments WHERE id = ?', [id]);
  },
};