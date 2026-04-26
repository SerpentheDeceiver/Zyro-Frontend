export const mockOrders = [
  {
    id: 'ord-001',
    orderId: 'ZY-ORD-1042',
    productTitle: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    productImage: 'https://picsum.photos/seed/prd-001/400/300',
    sellerName: 'Ganesh',
    amount: 23999,
    status: 'HELD',
    createdAt: '2026-04-10T08:20:00Z',
  },
  {
    id: 'ord-002',
    orderId: 'ZY-ORD-2178',
    productTitle: 'Atomic Habits + Deep Work Combo',
    productImage: 'https://picsum.photos/seed/prd-004/400/300',
    sellerName: 'Meera',
    amount: 799,
    status: 'RELEASED',
    createdAt: '2026-03-19T13:45:00Z',
  },
  {
    id: 'ord-003',
    orderId: 'ZY-ORD-3891',
    productTitle: 'Yonex Badminton Kit (Racket + Bag)',
    productImage: 'https://picsum.photos/seed/prd-005/400/300',
    sellerName: 'Arjun',
    amount: 3499,
    status: 'CANCELLED',
    createdAt: '2026-02-23T17:12:00Z',
  },
  {
    id: 'ord-004',
    orderId: 'ZY-ORD-4625',
    productTitle: 'Portable Projector with HDMI Adapter',
    productImage: 'https://picsum.photos/seed/prd-007/400/300',
    sellerName: 'Karan',
    amount: 8999,
    status: 'DISPUTED',
    createdAt: '2026-04-15T06:38:00Z',
  },
];

const withDelay = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), 600);
  });

export const getOrders = () => withDelay(mockOrders);

export const getOrderById = (id) => withDelay(mockOrders.find((order) => order.id === id) || null);

export const getOrderByOrderId = (orderId) =>
  withDelay(mockOrders.find((order) => order.orderId === orderId) || null);

