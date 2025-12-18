import { getDatabase } from '../database/init';
import { generateUUID } from '../utils/uuid';
import type { LabelTemplate, PackingTemplate, LabelTemplateConfig } from '../types';

export const templateService = {
  // Label Templates
  async getAllLabelTemplates(): Promise<LabelTemplate[]> {
    const db = getDatabase();
    return await db.getAllAsync<LabelTemplate>(
      'SELECT * FROM LabelTemplates ORDER BY template_name'
    );
  },

  async getLabelTemplateById(id: string): Promise<LabelTemplate | null> {
    const db = getDatabase();
    return await db.getFirstAsync<LabelTemplate>(
      'SELECT * FROM LabelTemplates WHERE id = ?',
      [id]
    );
  },

  async createLabelTemplate(
    templateName: string,
    assetTypeId: string,
    config: LabelTemplateConfig
  ): Promise<LabelTemplate> {
    const db = getDatabase();
    const id = await generateUUID();
    const configJson = JSON.stringify(config);

    await db.runAsync(
      'INSERT INTO LabelTemplates (id, template_name, asset_type_id, config_json) VALUES (?, ?, ?, ?)',
      [id, templateName, assetTypeId, configJson]
    );

    const template = await db.getFirstAsync<LabelTemplate>(
      'SELECT * FROM LabelTemplates WHERE id = ?',
      [id]
    );

    if (!template) {
      throw new Error('Failed to create label template');
    }

    return template;
  },

  async updateLabelTemplate(id: string, updates: Partial<LabelTemplate>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.template_name) {
      fields.push('template_name = ?');
      values.push(updates.template_name);
    }
    if (updates.config_json) {
      fields.push('config_json = ?');
      values.push(updates.config_json);
    }

    values.push(id);

    await db.runAsync(
      `UPDATE LabelTemplates SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteLabelTemplate(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM LabelTemplates WHERE id = ?', [id]);
  },

  // Packing Templates
  async getAllPackingTemplates(): Promise<PackingTemplate[]> {
    const db = getDatabase();
    return await db.getAllAsync<PackingTemplate>(
      'SELECT * FROM PackingTemplates ORDER BY template_name'
    );
  },

  async getPackingTemplateById(id: string): Promise<PackingTemplate | null> {
    const db = getDatabase();
    return await db.getFirstAsync<PackingTemplate>(
      'SELECT * FROM PackingTemplates WHERE id = ?',
      [id]
    );
  },

  async createPackingTemplate(
    templateName: string,
    hierarchy: string[]
  ): Promise<PackingTemplate> {
    const db = getDatabase();
    const id = await generateUUID();
    const hierarchyJson = JSON.stringify(hierarchy);

    await db.runAsync(
      'INSERT INTO PackingTemplates (id, template_name, hierarchy_json) VALUES (?, ?, ?)',
      [id, templateName, hierarchyJson]
    );

    const template = await db.getFirstAsync<PackingTemplate>(
      'SELECT * FROM PackingTemplates WHERE id = ?',
      [id]
    );

    if (!template) {
      throw new Error('Failed to create packing template');
    }

    return template;
  },

  async updatePackingTemplate(id: string, updates: Partial<PackingTemplate>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.template_name) {
      fields.push('template_name = ?');
      values.push(updates.template_name);
    }
    if (updates.hierarchy_json) {
      fields.push('hierarchy_json = ?');
      values.push(updates.hierarchy_json);
    }

    values.push(id);

    await db.runAsync(
      `UPDATE PackingTemplates SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deletePackingTemplate(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM PackingTemplates WHERE id = ?', [id]);
  },
};