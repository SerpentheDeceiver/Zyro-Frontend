import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../api';

export function useOrders() {
  const [buying, setBuying] = useState([]);
  const [selling, setSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [buyerOrders, sellerOrders] = await Promise.all([
        ordersAPI.getBuyingOrders(),
        ordersAPI.getSellingOrders(),
      ]);
      setBuying(buyerOrders || []);
      setSelling(sellerOrders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders');
      setBuying([]);
      setSelling([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const confirmDelivery = useCallback(
    async (id) => {
      await ordersAPI.confirmDelivery(id);
      toast.success('Escrow released to seller');
      await loadOrders();
    },
    [loadOrders]
  );

  return { buying, selling, loading, error, confirmDelivery, refetch: loadOrders };
}
