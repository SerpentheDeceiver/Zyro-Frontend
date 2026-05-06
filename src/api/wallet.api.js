import { apiClient, unwrap } from './client';
import { ordersAPI } from './orders.api';

export const walletAPI = {
  getBalance: async () => {
    const profile = unwrap(await apiClient.get('/users/me'));
    const walletBalance = profile?.wallet_balance ?? profile?.walletBalance ?? 0;
    return {
      balance: walletBalance,
      walletBalance,
      profile,
    };
  },
  getLedger: ordersAPI.getWalletHistory,
  topUp: async (amount) =>
    unwrap(await apiClient.post('/users/wallet/topup', null, { params: { amount } })),
  addFunds: async (amount) => walletAPI.topUp(amount),
};
