import { getCurrentMockUser, getMockState, getMyOrders, updateMockState } from './mockDb';

function nextOrderNumber() {
  return `ZY-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const ordersAPI = {
  createOrder: async (product) => {
    const me = getCurrentMockUser();
    const order = {
      id: `o-${Math.random().toString(16).slice(2, 8)}`,
      orderNumber: nextOrderNumber(),
      productId: product.id,
      productTitle: product.title,
      agreedPrice: product.price,
      buyerId: me.id,
      buyerName: me.fullName || 'Buyer',
      sellerId: product.sellerId,
      sellerName: product.sellerName || 'Seller',
      status: 'HELD',
      escrowStatus: 'HELD',
      buyerConfirmed: false,
      createdAt: new Date().toISOString(),
    };

    updateMockState((current) => {
      const next = {
        ...current,
        orders: [order, ...current.orders],
        walletLedger: [
          {
            id: `w-${Math.random().toString(16).slice(2, 8)}`,
            type: 'DEBIT',
            amount: order.agreedPrice,
            description: `Escrow hold for order ${order.orderNumber}`,
            createdAt: new Date().toISOString(),
          },
          ...current.walletLedger,
        ],
      };

      if (next.users.verified.id === me.id) {
        next.users.verified = {
          ...next.users.verified,
          walletBalance: Math.max(0, Number(next.users.verified.walletBalance || 0) - Number(order.agreedPrice || 0)),
        };
      } else {
        next.users.unverified = {
          ...next.users.unverified,
          walletBalance: Math.max(0, Number(next.users.unverified.walletBalance || 0) - Number(order.agreedPrice || 0)),
        };
      }

      return next;
    });

    return order;
  },

  getBuyingOrders: async () => getMyOrders().buying,

  getSellingOrders: async () => getMyOrders().selling,

  getOrder: async (id) => {
    const { orders } = getMockState();
    return orders.find((order) => order.id === id) || null;
  },

  confirmDelivery: async (id) => {
    let confirmedOrder = null;

    updateMockState((current) => {
      const nextOrders = current.orders.map((order) => {
        if (order.id !== id) return order;
        confirmedOrder = {
          ...order,
          buyerConfirmed: true,
          status: 'COMPLETED',
          escrowStatus: 'RELEASED',
        };
        return confirmedOrder;
      });

      if (!confirmedOrder) return current;

      return {
        ...current,
        orders: nextOrders,
        walletLedger: [
          {
            id: `w-${Math.random().toString(16).slice(2, 8)}`,
            type: 'CREDIT',
            amount: confirmedOrder.agreedPrice,
            description: `Escrow released for order ${confirmedOrder.orderNumber}`,
            createdAt: new Date().toISOString(),
          },
          ...current.walletLedger,
        ],
      };
    });

    return confirmedOrder;
  },

  cancelOrder: async (id, reason = 'Cancelled by user') => {
    let cancelledOrder = null;

    updateMockState((current) => ({
      ...current,
      orders: current.orders.map((order) => {
        if (order.id !== id) return order;
        cancelledOrder = { ...order, status: 'CANCELLED', escrowStatus: 'CANCELLED', cancelReason: reason };
        return cancelledOrder;
      }),
    }));

    return cancelledOrder;
  },

  raiseDispute: async (id, reason) => {
    let disputedOrder = null;

    updateMockState((current) => ({
      ...current,
      orders: current.orders.map((order) => {
        if (order.id !== id) return order;
        disputedOrder = { ...order, status: 'DISPUTED', escrowStatus: 'DISPUTED', disputeReason: reason };
        return disputedOrder;
      }),
    }));

    return disputedOrder;
  },

  getWalletHistory: async () => getMockState().walletLedger,
};
