import { getCurrentMockUser, getMockState, updateMockState } from './mockDb';

function asPage(content) {
  return {
    content,
    pageNumber: 0,
    pageSize: content.length,
    totalElements: content.length,
    totalPages: 1,
  };
}

export const productsAPI = {
  getProducts: async () => {
    const { products } = getMockState();
    return asPage(products.filter((product) => product.status !== 'DELETED'));
  },

  getProduct: async (id) => {
    const { products } = getMockState();
    return products.find((product) => product.id === id) || null;
  },

  getMyListings: async () => {
    const me = getCurrentMockUser();
    const { products } = getMockState();
    return asPage(products.filter((product) => product.sellerId === me.id && product.status !== 'DELETED'));
  },

  createProduct: async (payload) => {
    const me = getCurrentMockUser();
    const id = `p-${Math.random().toString(16).slice(2, 8)}`;
    const created = {
      id,
      title: payload.title,
      description: payload.description,
      price: payload.price,
      condition: payload.condition || 'GOOD',
      status: 'DRAFT',
      categoryName: payload.categoryName || 'Other',
      transactionType: payload.transactionType || 'REMOTE',
      locationCity: payload.locationCity || '',
      locationState: payload.locationState || '',
      sellerId: me.id,
      sellerName: me.fullName || 'Mock Seller',
      imageUrls: payload.imageUrls || [],
      primaryImageUrl: payload.imageUrls?.[0] || '',
      createdAt: new Date().toISOString(),
    };

    updateMockState((current) => ({
      ...current,
      products: [created, ...current.products],
    }));

    return created;
  },

  publishProduct: async (id) => {
    let published = null;

    updateMockState((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== id) return product;
        published = { ...product, status: 'ACTIVE' };
        return published;
      }),
    }));

    return published;
  },

  deleteProduct: async (id) => {
    updateMockState((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id ? { ...product, status: 'DELETED' } : product
      ),
    }));
    return { success: true };
  },
};
