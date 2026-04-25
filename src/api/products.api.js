import { apiClient, unwrap } from './client';

export const productsAPI = {
  getProducts: async (params = {}) => unwrap(await apiClient.get('/products', { params })),
  getProduct: async (id) => unwrap(await apiClient.get(`/products/${id}`)),
  getMyListings: async (params = {}) => unwrap(await apiClient.get('/products/my', { params })),
  createProduct: async (payload) => unwrap(await apiClient.post('/products', payload)),
  publishProduct: async (id) => unwrap(await apiClient.patch(`/products/${id}/publish`)),
  deleteProduct: async (id) => unwrap(await apiClient.delete(`/products/${id}`)),
};
