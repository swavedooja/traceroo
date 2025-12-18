import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import type { Location, LocationType } from '../types';

export const locationService = {
  async getAllLocations(): Promise<Location[]> {
    const db = getDatabase();
    return await db.getAllAsync<Location>('SELECT * FROM Locations ORDER BY name');
  },

  async getLocationById(id: string): Promise<Location | null> {
    const db = getDatabase();
    return await db.getFirstAsync<Location>(
      'SELECT * FROM Locations WHERE id = ?',
      [id]
    );
  },

  async getLocationByQRData(qrData: string): Promise<Location | null> {
    const db = getDatabase();
    return await db.getFirstAsync<Location>(
      'SELECT * FROM Locations WHERE location_qr_data = ?',
      [qrData]
    );
  },

  async createLocation(
    name: string,
    locationTypeId: string,
    parentLocationId: string | null = null
  ): Promise<Location> {
    const db = getDatabase();
    const id = await generateUUID();
    const qrData = `LOC-${id}`;

    await db.runAsync(
      'INSERT INTO Locations (id, name, location_type_id, parent_location_id, location_qr_data) VALUES (?, ?, ?, ?, ?)',
      [id, name, locationTypeId, parentLocationId, qrData]
    );

    const location = await db.getFirstAsync<Location>(
      'SELECT * FROM Locations WHERE id = ?',
      [id]
    );

    if (!location) {
      throw new Error('Failed to create location');
    }

    return location;
  },

  async updateLocation(id: string, updates: Partial<Location>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.location_type_id) {
      fields.push('location_type_id = ?');
      values.push(updates.location_type_id);
    }
    if (updates.parent_location_id !== undefined) {
      fields.push('parent_location_id = ?');
      values.push(updates.parent_location_id);
    }

    values.push(id);

    await db.runAsync(
      `UPDATE Locations SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteLocation(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM Locations WHERE id = ?', [id]);
  },

  // Location Types
  async getAllLocationTypes(): Promise<LocationType[]> {
    const db = getDatabase();
    return await db.getAllAsync<LocationType>('SELECT * FROM LocationTypes ORDER BY name');
  },

  async createLocationType(name: string, parentLocationTypeId: string | null = null): Promise<LocationType> {
    const db = getDatabase();
    const id = await generateUUID();

    await db.runAsync(
      'INSERT INTO LocationTypes (id, name, parent_location_type_id) VALUES (?, ?, ?)',
      [id, name, parentLocationTypeId]
    );

    const locationType = await db.getFirstAsync<LocationType>(
      'SELECT * FROM LocationTypes WHERE id = ?',
      [id]
    );

    if (!locationType) {
      throw new Error('Failed to create location type');
    }

    return locationType;
  },
};