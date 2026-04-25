import { getCurrentMockUser, pickMockUserForLogin, setCurrentMockUser } from './mockDb';

export const mockUser = {
  id: '1',
  name: 'Demo User',
  isVerified: true,
  walletBalance: 2500,
};

export const authAPI = {
  sendOTP: async (mobile) => ({
    success: true,
    mobile,
    message: 'Mock OTP sent',
  }),

  verifyOTP: async (mobile) => {
    const selectedUser = pickMockUserForLogin(mobile);
    setCurrentMockUser(selectedUser);

    return {
      token: 'mock-access-token',
      userId: selectedUser.id,
      mobile: selectedUser.mobile,
      fullName: selectedUser.fullName,
      role: selectedUser.role,
      user: selectedUser,
    };
  },

  getCurrentUser: async () => getCurrentMockUser(),

  updateProfile: async (payload) => {
    const current = getCurrentMockUser();
    const updated = { ...current, ...payload };
    setCurrentMockUser(updated);
    return updated;
  },

  becomeSeller: async () => {
    const current = getCurrentMockUser();
    const updated = { ...current, isVerified: true };
    setCurrentMockUser(updated);
    return updated;
  },
};
