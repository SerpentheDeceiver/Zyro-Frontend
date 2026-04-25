import { apiClient, unwrap } from './client';

export const ordersAPI = {
  createOrder: async (product) =>
    unwrap(
      await apiClient.post('/orders', {
        productId: product.id,
        sellerId: product.sellerId,
        agreedPrice: product.price,
        transactionType: product.transactionType || 'REMOTE',
      })
    ),
  getBuyingOrders: async () => unwrap(await apiClient.get('/orders/my/buying')),
  getSellingOrders: async () => unwrap(await apiClient.get('/orders/my/selling')),
  getOrder: async (id) => unwrap(await apiClient.get(`/orders/${id}`)),
  confirmDelivery: async (id) => unwrap(await apiClient.post(`/orders/${id}/confirm-delivery`)),
  cancelOrder: async (id, reason) =>
    unwrap(await apiClient.post(`/orders/${id}/cancel`, null, { params: { reason } })),
  raiseDispute: async (id, reason) => unwrap(await apiClient.post(`/orders/${id}/dispute`, { reason })),
  getWalletHistory: async () => unwrap(await apiClient.get('/orders/my/wallet-history')),
};
