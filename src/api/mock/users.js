export const mockUser = {
  id: 'usr-001',
  name: 'Ganesh',
  mobile: '+919025169190',
  email: 'ganesh@zyro.app',
  avatarUrl: null,
  role: 'SELLER',
  isVerified: true,
  walletBalance: 7500,
  joinedAt: '2025-12-26',
};

const withDelay = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), 600);
  });

export const getUser = () => withDelay(mockUser);

