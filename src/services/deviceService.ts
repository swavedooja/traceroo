import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import type { Device } from '../types';

export const deviceService = {
  async getDeviceByIdentifier(deviceIdentifier: string): Promise<Device | null> {
    const db = getDatabase();
    return await db.getFirstAsync<Device>(
      'SELECT * FROM Devices WHERE device_identifier = ?',
      [deviceIdentifier]
    );
  },

  async registerDevice(
    deviceIdentifier: string,
    deviceName: string,
    assignedLocationId: string
  ): Promise<Device> {
    const db = getDatabase();
    const id = await generateUUID();

    await db.runAsync(
      'INSERT INTO Devices (id, device_identifier, device_name, assigned_location_id) VALUES (?, ?, ?, ?)',
      [id, deviceIdentifier, deviceName, assignedLocationId]
    );

    const device = await db.getFirstAsync<Device>(
      'SELECT * FROM Devices WHERE id = ?',
      [id]
    );

    if (!device) {
      throw new Error('Failed to register device');
    }

    return device;
  },

  async updateDeviceLastLogin(deviceIdentifier: string, userId: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE Devices SET last_logged_in_user_id = ? WHERE device_identifier = ?',
      [userId, deviceIdentifier]
    );
  },

  async getAllDevices(): Promise<Device[]> {
    const db = getDatabase();
    return await db.getAllAsync<Device>('SELECT * FROM Devices ORDER BY device_name');
  },

  async updateDevice(id: string, updates: Partial<Device>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.device_name) {
      fields.push('device_name = ?');
      values.push(updates.device_name);
    }
    if (updates.assigned_location_id) {
      fields.push('assigned_location_id = ?');
      values.push(updates.assigned_location_id);
    }

    values.push(id);

    await db.runAsync(
      `UPDATE Devices SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteDevice(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM Devices WHERE id = ?', [id]);
  },
};