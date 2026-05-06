import { apiClient, unwrap } from './client';

export const ordersAPI = {
  createOrder: async (product) => {
    const payload = product.productId
      ? product
      : {
          productId: product.id,
          sellerId: product.sellerId,
          agreedPrice: product.price,
          transactionType: product.transactionType || 'REMOTE',
        };

    return unwrap(await apiClient.post('/orders', payload));
  },
  getMyBuyingOrders: async () => unwrap(await apiClient.get('/orders/my/buying')),
  getMySellingOrders: async () => unwrap(await apiClient.get('/orders/my/selling')),
  getBuyingOrders: async () => unwrap(await apiClient.get('/orders/my/buying')),
  getSellingOrders: async () => unwrap(await apiClient.get('/orders/my/selling')),
  getOrder: async (id) => unwrap(await apiClient.get(`/orders/${id}`)),
  confirmDelivery: async (id) => unwrap(await apiClient.post(`/orders/${id}/confirm-delivery`)),
  cancelOrder: async (id, reason) =>
    unwrap(
      await apiClient.post(`/orders/${id}/cancel`, null, {
        params: { reason: reason || 'Cancelled by user' },
      })
    ),
  raiseDispute: async (id, reason) => unwrap(await apiClient.post(`/orders/${id}/dispute`, { reason })),
  getWalletHistory: async () => unwrap(await apiClient.get('/orders/my/wallet-history')),
};
