import { apiClient, unwrap } from './client';

export const authAPI = {
  sendOTP: async (mobile) => unwrap(await apiClient.post('/auth/send-otp', { mobile })),
  verifyOTP: async (mobile, otp) => unwrap(await apiClient.post('/auth/verify-otp', { mobile, otp })),
  getCurrentUser: async () => unwrap(await apiClient.get('/users/me')),
  updateProfile: async (payload) => unwrap(await apiClient.put('/users/me', payload)),
  becomeSeller: async () => unwrap(await apiClient.post('/users/me/become-seller')),
};
