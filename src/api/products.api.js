import { apiClient, unwrap } from './client';

async function resolveCategoryId(category) {
  if (!category) return undefined;

  const categories = await productsAPI.getCategories();
  const match = categories.find((item) => item.id === category || item.name?.toLowerCase() === String(category).toLowerCase());
  return match?.id;
}

export const productsAPI = {
  getProducts: async (params = {}) => unwrap(await apiClient.get('/products', { params })),
  getProduct: async (id) => unwrap(await apiClient.get(`/products/${id}`)),
  getMyProducts: async (params = {}) => unwrap(await apiClient.get('/products/my', { params })),
  getMyListings: async (params = {}) => unwrap(await apiClient.get('/products/my', { params })),
  createProduct: async (payload) => {
    const categoryId = payload.categoryId || (await resolveCategoryId(payload.category || payload.categoryName));
    const rest = { ...payload };
    delete rest.category;
    delete rest.categoryName;
    return unwrap(await apiClient.post('/products', { ...rest, categoryId }));
  },
  publishProduct: async (id) => unwrap(await apiClient.patch(`/products/${id}/publish`)),
  deleteProduct: async (id) => unwrap(await apiClient.delete(`/products/${id}`)),
  getCategories: async () => unwrap(await apiClient.get('/categories')),
};
