import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { walletAPI } from '../api';

export function useWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWallet = useCallback(async () => {
    setLoading(true);
    try {
      const [balanceResponse, ledger] = await Promise.all([walletAPI.getBalance(), walletAPI.getLedger()]);
      setBalance(balanceResponse.walletBalance ?? balanceResponse.balance ?? 0);
      setTransactions(ledger || []);
    } catch {
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const addFunds = useCallback(
    async (amount) => {
      const profile = await walletAPI.addFunds(amount);
      setBalance(profile.walletBalance ?? 0);
      await loadWallet();
      toast.success('Wallet topped up');
    },
    [loadWallet]
  );

  return { balance, transactions, loading, addFunds, refetch: loadWallet };
}
