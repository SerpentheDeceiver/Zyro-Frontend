const MOCK_DB_KEY = 'zyro_mock_db';

const now = Date.now();

const DEFAULT_STATE = {
  users: {
    verified: {
      id: '1',
      mobile: '+919876543210',
      fullName: 'Demo User',
      email: 'demo@zyro.app',
      avatarUrl: '',
      role: 'BUYER',
      isVerified: true,
      walletBalance: 2500,
      createdAt: new Date(now - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    unverified: {
      id: '2',
      mobile: '+919111110000',
      fullName: 'New Buyer',
      email: 'new@zyro.app',
      avatarUrl: '',
      role: 'BUYER',
      isVerified: false,
      walletBalance: 800,
      createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  currentUserId: null,
  products: [
    {
      id: 'p-101',
      title: 'iPhone 13 128GB',
      description: 'Excellent condition. Battery health 88%. Includes original box.',
      price: 42999,
      categoryName: 'Electronics',
      condition: 'GOOD',
      status: 'ACTIVE',
      transactionType: 'REMOTE',
      locationCity: 'Bengaluru',
      locationState: 'Karnataka',
      sellerId: '33',
      sellerName: 'Arjun N',
      imageUrls: ['https://images.unsplash.com/photo-1603898037225-1c6f3f0e0b3d?auto=format&fit=crop&w=900&q=80'],
      primaryImageUrl: 'https://images.unsplash.com/photo-1603898037225-1c6f3f0e0b3d?auto=format&fit=crop&w=900&q=80',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'p-102',
      title: 'Nike Air Zoom Running Shoes',
      description: 'Size UK 9. Used for 3 months. Lightweight and clean.',
      price: 3499,
      categoryName: 'Fashion',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      transactionType: 'REMOTE',
      locationCity: 'Pune',
      locationState: 'Maharashtra',
      sellerId: '44',
      sellerName: 'Meera S',
      imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
      primaryImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'p-103',
      title: 'Wooden Study Desk',
      description: 'Solid wood desk with drawer storage. Pickup preferred.',
      price: 7200,
      categoryName: 'Home',
      condition: 'GOOD',
      status: 'ACTIVE',
      transactionType: 'LOCAL',
      locationCity: 'Hyderabad',
      locationState: 'Telangana',
      sellerId: '55',
      sellerName: 'Rahul T',
      imageUrls: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80'],
      primaryImageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80',
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  chats: [
    {
      id: 'c-1',
      productId: 'p-101',
      productTitle: 'iPhone 13 128GB',
      buyerId: '1',
      buyerName: 'Demo User',
      sellerId: '33',
      sellerName: 'Arjun N',
      lastMessage: 'Can you share the battery health screenshot?',
      updatedAt: new Date(now - 45 * 60 * 1000).toISOString(),
    },
  ],
  messages: {
    'c-1': [
      {
        id: 'm-1',
        chatId: 'c-1',
        senderId: '33',
        content: 'Hi, yes this is still available.',
        messageType: 'TEXT',
        createdAt: new Date(now - 90 * 60 * 1000).toISOString(),
      },
      {
        id: 'm-2',
        chatId: 'c-1',
        senderId: '1',
        content: 'Great. Is there any scratch on screen?',
        messageType: 'TEXT',
        createdAt: new Date(now - 70 * 60 * 1000).toISOString(),
      },
      {
        id: 'm-3',
        chatId: 'c-1',
        senderId: '33',
        content: 'No scratches. I can share close-up photos.',
        messageType: 'TEXT',
        createdAt: new Date(now - 55 * 60 * 1000).toISOString(),
      },
      {
        id: 'm-4',
        chatId: 'c-1',
        senderId: '1',
        content: 'Can you share the battery health screenshot?',
        messageType: 'TEXT',
        createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  orders: [
    {
      id: 'o-101',
      orderNumber: 'ZY-ORD-0101',
      productId: 'p-102',
      productTitle: 'Nike Air Zoom Running Shoes',
      agreedPrice: 3499,
      buyerId: '1',
      buyerName: 'Demo User',
      sellerId: '44',
      sellerName: 'Meera S',
      status: 'HELD',
      escrowStatus: 'HELD',
      buyerConfirmed: false,
      createdAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
    },
  ],
  walletLedger: [
    {
      id: 'w-1',
      type: 'CREDIT',
      amount: 5000,
      description: 'Wallet top-up',
      createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'w-2',
      type: 'DEBIT',
      amount: 2500,
      description: 'Escrow hold for order ZY-ORD-0098',
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const raw = localStorage.getItem(MOCK_DB_KEY);
    if (!raw) return deepClone(DEFAULT_STATE);
    return { ...deepClone(DEFAULT_STATE), ...JSON.parse(raw) };
  } catch {
    return deepClone(DEFAULT_STATE);
  }
}

let state = loadState();

function persist() {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(state));
}

export function getMockState() {
  return state;
}

export function updateMockState(updater) {
  state = updater(state);
  persist();
  return state;
}

export function resetMockState() {
  state = deepClone(DEFAULT_STATE);
  persist();
  return state;
}

export function getCurrentMockUser() {
  const currentId = state.currentUserId || state.users.verified.id;
  return state.users.verified.id === currentId ? state.users.verified : state.users.unverified;
}

export function pickMockUserForLogin(mobile = '') {
  const normalized = String(mobile).replace(/\s/g, '');
  // Quick way to test seller guard: any mobile ending with 0000 becomes unverified.
  const useUnverified = normalized.endsWith('0000');
  return deepClone(useUnverified ? state.users.unverified : state.users.verified);
}

export function setCurrentMockUser(user) {
  return updateMockState((current) => {
    const next = deepClone(current);
    const key = user?.isVerified ? 'verified' : 'unverified';
    next.users[key] = { ...next.users[key], ...user };
    next.currentUserId = next.users[key].id;
    return next;
  });
}

export function getMyOrders() {
  const me = getCurrentMockUser();
  return {
    buying: state.orders.filter((order) => order.buyerId === me.id),
    selling: state.orders.filter((order) => order.sellerId === me.id),
  };
}
