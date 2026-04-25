import { apiClient, unwrap } from './client';

export const escrowAPI = {
  getByOrder: async (orderId) => unwrap(await apiClient.get(`/escrow/order/${orderId}`)),
};
