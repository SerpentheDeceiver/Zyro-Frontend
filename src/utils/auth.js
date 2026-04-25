export function canSell(user) {
  return Boolean(user?.isVerified);
}

export function buildUserFromAuth(authResponse) {
  return {
    id: authResponse?.userId,
    mobile: authResponse?.mobile,
    fullName: authResponse?.fullName || 'Zyro Member',
    role: authResponse?.role || 'BUYER',
    isVerified: false,
  };
}
