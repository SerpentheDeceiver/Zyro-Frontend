export function canSell(user) {
  return Boolean(user?.isVerified);
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
