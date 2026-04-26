export const mockWalletHistory = [
  {
    id: 'txn-001',
    type: 'CREDIT',
    amount: 5000,
    description: 'Wallet top-up via UPI',
    date: '2026-04-01',
    orderId: null,
  },
  {
    id: 'txn-002',
    type: 'DEBIT',
    amount: 23999,
    description: 'Escrow hold for Sony WH-1000XM5',
    date: '2026-04-10',
    orderId: 'ZY-ORD-1042',
  },
  {
    id: 'txn-003',
    type: 'CREDIT',
    amount: 23999,
    description: 'Order released to seller',
    date: '2026-04-13',
    orderId: 'ZY-ORD-1042',
  },
  {
    id: 'txn-004',
    type: 'DEBIT',
    amount: 799,
    description: 'Escrow hold for books combo',
    date: '2026-03-19',
    orderId: 'ZY-ORD-2178',
  },
  {
    id: 'txn-005',
    type: 'CREDIT',
    amount: 799,
    description: 'Refund for cancelled book order',
    date: '2026-03-21',
    orderId: 'ZY-ORD-2178',
  },
  {
    id: 'txn-006',
    type: 'DEBIT',
    amount: 3499,
    description: 'Escrow hold for badminton kit',
    date: '2026-02-23',
    orderId: 'ZY-ORD-3891',
  },
  {
    id: 'txn-007',
    type: 'CREDIT',
    amount: 3499,
    description: 'Escrow reversal after cancellation',
    date: '2026-02-24',
    orderId: 'ZY-ORD-3891',
  },
  {
    id: 'txn-008',
    type: 'DEBIT',
    amount: 8999,
    description: 'Escrow hold for projector purchase',
    date: '2026-04-15',
    orderId: 'ZY-ORD-4625',
  },
  {
    id: 'txn-009',
    type: 'CREDIT',
    amount: 3000,
    description: 'Referral bonus payout',
    date: '2026-04-18',
    orderId: null,
  },
  {
    id: 'txn-010',
    type: 'DEBIT',
    amount: 2500,
    description: 'Withdrawal to bank account',
    date: '2026-04-22',
    orderId: null,
  },
];

const withDelay = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), 600);
  });

export const getWalletHistory = () => withDelay(mockWalletHistory);

