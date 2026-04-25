import { apiClient, unwrap } from './client';
import { ordersAPI } from './orders.api';

export const walletAPI = {
  getBalance: async () => {
    const profile = unwrap(await apiClient.get('/users/me'));
    return {
      balance: profile?.walletBalance ?? 0,
      walletBalance: profile?.walletBalance ?? 0,
      profile,
    };
  },
  getLedger: ordersAPI.getWalletHistory,
  addFunds: async (amount) =>
    unwrap(await apiClient.post('/users/wallet/topup', null, { params: { amount } })),
};
