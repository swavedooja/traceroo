import axios from 'axios';
import { mockData } from './mockData';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || process.env.NODE_ENV === 'production'; // Default to mock in production for GitHub Pages demo if not specified otherwise

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Helper to simulate network delay
const mockDelay = (data, ms = 500) => new Promise(resolve => setTimeout(() => resolve(data), ms));

export const MaterialsAPI = {
  list: (params) => USE_MOCK ? mockDelay(mockData.materials.list) : api.get('/materials', { params }).then(r => r.data),
  get: (code) => USE_MOCK ? mockDelay(mockData.materials.details(code)) : api.get(`/materials/${code}`).then(r => r.data),
  create: (payload) => USE_MOCK ? mockDelay({ ...payload, id: 'MOCK-NEW-ID' }) : api.post('/materials', payload).then(r => r.data),
  update: (code, payload) => USE_MOCK ? mockDelay({ ...payload, material_code: code }) : api.put(`/materials/${code}`, payload).then(r => r.data),
  remove: (code) => USE_MOCK ? mockDelay({ success: true }) : api.delete(`/materials/${code}`).then(r => r.data),
  images: (code) => USE_MOCK ? mockDelay(mockData.materials.images) : api.get(`/materials/${code}/images`).then(r => r.data),
  documents: (code) => USE_MOCK ? mockDelay(mockData.materials.documents) : api.get(`/materials/${code}/documents`).then(r => r.data),
  uploadImage: (code, file, type = 'material') => {
    if (USE_MOCK) return mockDelay({ id: Math.random(), url: URL.createObjectURL(file), type });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    return api.post(`/materials/${code}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  uploadDocument: (code, file, docType) => {
    if (USE_MOCK) return mockDelay({ id: Math.random(), name: file.name, url: '#', type: docType });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('docType', docType);
    return api.post(`/materials/${code}/documents`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
};

export const PackagingAPI = {
  create: (payload) => USE_MOCK ? mockDelay({ ...payload, id: 'PKG-NEW' }) : api.post('/packaging-hierarchy', payload).then(r => r.data),
  get: (id) => USE_MOCK ? mockDelay(mockData.packaging.get(id)) : api.get(`/packaging-hierarchy/${id}`).then(r => r.data),
  update: (id, payload) => USE_MOCK ? mockDelay({ ...payload, id }) : api.put(`/packaging-hierarchy/${id}`, payload).then(r => r.data),
  remove: (id) => USE_MOCK ? mockDelay({ success: true }) : api.delete(`/packaging-hierarchy/${id}`).then(r => r.data),
  preview: (id) => USE_MOCK ? mockDelay(mockData.packaging.preview(id)) : api.get(`/packaging-hierarchy/${id}/preview`).then(r => r.data),
};

export const WarehouseAPI = {
  list: () => USE_MOCK ? mockDelay(mockData.warehouses.list) : api.get('/warehouses').then(r => r.data),
  get: (code) => USE_MOCK ? mockDelay(mockData.warehouses.details(code)) : api.get(`/warehouses/${code}`).then(r => r.data),
  create: (payload) => USE_MOCK ? mockDelay({ ...payload, warehouse_code: 'WH-NEW' }) : api.post('/warehouses', payload).then(r => r.data),
  update: (code, payload) => USE_MOCK ? mockDelay({ ...payload, warehouse_code: code }) : api.put(`/warehouses/${code}`, payload).then(r => r.data),
  remove: (code) => USE_MOCK ? mockDelay({ success: true }) : api.delete(`/warehouses/${code}`).then(r => r.data),
};

export const LabelTemplateAPI = {
  list: () => USE_MOCK ? mockDelay(mockData.labelTemplates.list) : api.get('/label-templates').then(r => r.data),
  get: (id) => USE_MOCK ? mockDelay(mockData.labelTemplates.details(id)) : api.get(`/label-templates/${id}`).then(r => r.data),
  create: (payload) => USE_MOCK ? mockDelay({ ...payload, id: Math.floor(Math.random() * 1000) }) : api.post('/label-templates', payload).then(r => r.data),
  update: (id, payload) => USE_MOCK ? mockDelay({ ...payload, id }) : api.put(`/label-templates/${id}`, payload).then(r => r.data),
  remove: (id) => USE_MOCK ? mockDelay({ success: true }) : api.delete(`/label-templates/${id}`).then(r => r.data),
};

export const InventoryAPI = {
  list: () => USE_MOCK ? mockDelay(mockData.inventory.list) : api.get('/inventory').then(r => r.data),
  registerBatch: (payload) => USE_MOCK ? mockDelay({ success: true, ...payload }) : api.post('/inventory/register-batch', payload).then(r => r.data),
  packBox: (payload) => USE_MOCK ? mockDelay({ success: true, ...payload }) : api.post('/inventory/pack-box', payload).then(r => r.data),
};

export const TraceAPI = {
  getHistory: (serial) => USE_MOCK ? mockDelay(mockData.trace.history(serial)) : api.get(`/trace/${serial}`).then(r => r.data),
};

export default api;
