import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import { hashPassword, verifyPassword } from '../utils/password';
import type { User, UserRole } from '../types';

export const userService = {
  async authenticate(username: string, password: string): Promise<User | null> {
    const db = getDatabase();
    const user = await db.getFirstAsync<User>(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return user;
  },

  async createUser(username: string, password: string, role: UserRole): Promise<User> {
    const db = getDatabase();
    const id = await generateUUID();
    const password_hash = await hashPassword(password);

    await db.runAsync(
      'INSERT INTO Users (id, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [id, username, password_hash, role]
    );

    const user = await db.getFirstAsync<User>(
      'SELECT * FROM Users WHERE id = ?',
      [id]
    );

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  },

  async getAllUsers(): Promise<User[]> {
    const db = getDatabase();
    return await db.getAllAsync<User>('SELECT * FROM Users ORDER BY username');
  },

  async getUserById(id: string): Promise<User | null> {
    const db = getDatabase();
    return await db.getFirstAsync<User>('SELECT * FROM Users WHERE id = ?', [id]);
  },

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const db = getDatabase();
    return await db.getAllAsync<User>('SELECT * FROM Users WHERE role = ?', [role]);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.username) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.role) {
      fields.push('role = ?');
      values.push(updates.role);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.runAsync(
      `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteUser(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM Users WHERE id = ?', [id]);
  },
};