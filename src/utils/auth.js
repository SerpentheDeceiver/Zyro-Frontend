import { USE_MOCK } from '../api/config';

export function canSell(user) {
  return USE_MOCK ? Boolean(user?.isVerified) : user?.role === 'SELLER';
}

export function buildUserFromAuth(authResponse) {
  if (authResponse?.user) return authResponse.user;

  return {
    id: authResponse?.userId,
    mobile: authResponse?.mobile,
    fullName: authResponse?.fullName || 'Zyro Member',
    role: authResponse?.role || 'BUYER',
    isVerified: Boolean(authResponse?.isVerified),
    walletBalance: authResponse?.walletBalance ?? authResponse?.wallet_balance ?? 0,
  };
}
