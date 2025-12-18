import { Platform } from 'react-native';
import { createTablesSQL } from './schema';
import { createFixedAssetTablesSQL } from './fixedAssetSchema';
import { generateUUID } from '../utils/uuid';
import { hashPassword } from '../utils/password';

// Dynamic import to prevent SQLite from being bundled on web
let SQLite: typeof import('expo-sqlite') | null = null;
let db: any = null;

const getSQLite = async () => {
  if (Platform.OS === 'web') {
    throw new Error('SQLite is not supported on web platform.');
  }

  if (!SQLite) {
    SQLite = await import('expo-sqlite');
  }
  return SQLite;
};

export const initDatabase = async () => {
  // SQLite is not supported on web platform
  if (Platform.OS === 'web') {
    throw new Error('SQLite is not supported on web platform. This app requires a mobile device.');
  }

  if (db) {
    return db;
  }

  try {
    const SQLiteModule = await getSQLite();
    db = await SQLiteModule.openDatabaseAsync('traceroo.db');

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create all tables
    await db.execAsync(createTablesSQL);
    await db.execAsync(createFixedAssetTablesSQL);

    // Check if we need to seed initial data
    await seedInitialData(db);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (Platform.OS === 'web') {
    throw new Error('SQLite is not supported on web platform.');
  }

  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
};

const seedInitialData = async (database: any) => {
  try {
    // Check if admin user exists
    const result = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM Users WHERE role = ?',
      ['Administrator']
    );

    if (result && result.count === 0) {
      // Create default admin user
      const adminId = await generateUUID();
      const adminPassword = await hashPassword('admin123');

      await database.runAsync(
        'INSERT INTO Users (id, username, password_hash, role) VALUES (?, ?, ?, ?)',
        [adminId, 'admin', adminPassword, 'Administrator']
      );

      // Create default asset types
      const assetTypes = ['Item', 'Box', 'Pallet', 'Container'];
      for (const typeName of assetTypes) {
        const typeId = await generateUUID();
        await database.runAsync(
          'INSERT INTO AssetTypes (id, name) VALUES (?, ?)',
          [typeId, typeName]
        );
      }

      // Create default location type
      const locationTypeId = await generateUUID();
      await database.runAsync(
        'INSERT INTO LocationTypes (id, name) VALUES (?, ?)',
        [locationTypeId, 'Warehouse']
      );

      // Create default location
      const locationId = await generateUUID();
      await database.runAsync(
        'INSERT INTO Locations (id, name, location_type_id, location_qr_data) VALUES (?, ?, ?, ?)',
        [locationId, 'Main Warehouse', locationTypeId, `LOC-${locationId}`]
      );

      console.log('Initial data seeded successfully');
      console.log('Default admin credentials: username=admin, password=admin123');
    }

    // Seed Fixed Asset Locations for Vedanta if they don't exist
    const locCount = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM FixedAssetLocations'
    );
    if (locCount && locCount.count === 0) {
      const locations = [
        { name: 'Jharsuguda', dept: 'Main Plant' },
        { name: 'Lanigarh', dept: 'Refinery' },
        { name: 'Kakinada', dept: 'Port Operations' },
        { name: 'Bhubaneswar', dept: 'Corporate Office' },
        { name: 'Mines', dept: 'Extraction Site' }
      ];
      for (const loc of locations) {
        const id = await generateUUID();
        await database.runAsync(
          'INSERT INTO FixedAssetLocations (id, name, department, location_qr_data) VALUES (?, ?, ?, ?)',
          [id, loc.name, loc.dept, `LOC-${loc.name.toUpperCase()}`]
        );
      }
    }

    // Seed Fixed Asset Types if they don't exist
    const typeCount = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM FixedAssetTypes'
    );
    if (typeCount && typeCount.count === 0) {
      const assetTypes = ['Air Conditioner', 'Exhaust Fan', 'Transformer', 'Cranes', 'Vehicles', 'IT Assets'];
      for (const typeName of assetTypes) {
        const typeId = await generateUUID();
        await database.runAsync(
          'INSERT INTO FixedAssetTypes (id, name) VALUES (?, ?)',
          [typeId, typeName]
        );
      }
    }

  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};