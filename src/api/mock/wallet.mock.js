import { getCurrentMockUser, getMockState, setCurrentMockUser, updateMockState } from './mockDb';

export const walletAPI = {
  getBalance: async () => {
    const profile = getCurrentMockUser();
    return {
      balance: profile.walletBalance ?? 0,
      walletBalance: profile.walletBalance ?? 0,
      profile,
    };
  },

  getLedger: async () => getMockState().walletLedger,

  addFunds: async (amount) => {
    const current = getCurrentMockUser();
    const nextBalance = Number(current.walletBalance || 0) + Number(amount || 0);
    const updatedProfile = { ...current, walletBalance: nextBalance };
    setCurrentMockUser(updatedProfile);

    updateMockState((state) => ({
      ...state,
      walletLedger: [
        {
          id: `w-${Math.random().toString(16).slice(2, 8)}`,
          type: 'CREDIT',
          amount: Number(amount || 0),
          description: 'Wallet top-up',
          createdAt: new Date().toISOString(),
        },
        ...state.walletLedger,
      ],
    }));

    return updatedProfile;
  },
};
