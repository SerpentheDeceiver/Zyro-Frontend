import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../api';

export function useOrders() {
  const [buying, setBuying] = useState([]);
  const [selling, setSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [buyerOrders, sellerOrders] = await Promise.all([
        ordersAPI.getBuyingOrders(),
        ordersAPI.getSellingOrders(),
      ]);
      setBuying(buyerOrders || []);
      setSelling(sellerOrders || []);
    } catch {
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

  return { buying, selling, loading, confirmDelivery, refetch: loadOrders };
}
