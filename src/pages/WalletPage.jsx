import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import Modal from '../components/common/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { mockUser, getWalletHistory } from '../api/mock/index.js';
import { formatCurrency, formatDate } from '../utils/format';

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(mockUser.walletBalance);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const countUpRef = useRef(null);

  // Animate number count-up on load
  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayBalance(Math.floor(balance * progress));
      if (progress === 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [balance]);

  const [txError, setTxError] = useState(null);

  // Load transactions
  async function loadTransactions() {
    setLoading(true);
    setTxError(null);
    try {
      const history = await getWalletHistory();
      setTransactions(history || []);
    } catch {
      setTxError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  // mock data uses a 'date' string (YYYY-MM-DD), not 'createdAt'
  const monthTransactions = transactions.filter((txn) => {
    const txnMonth = (txn.date || txn.createdAt || '').slice(0, 7);
    return txnMonth === selectedMonth;
  });

  const monthCredit = monthTransactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthDebit = monthTransactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const groupedByDate = {};
  monthTransactions.forEach((txn) => {
    const dateKey = txn.date || new Date(txn.createdAt).toDateString();
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(txn);
  });

  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8 animate-fade-slide-up">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero Section */}
        <section className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 text-white shadow-soft overflow-hidden relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute h-40 w-40 rounded-full blur-3xl bg-white -top-20 -left-20 animate-pulse" />
            <div className="absolute h-40 w-40 rounded-full blur-3xl bg-white -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10">
            <p className="text-sm font-semibold opacity-90">Available Balance</p>
            <p className="mt-3 text-5xl font-black">₹{displayBalance.toLocaleString('en-IN')}</p>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <div
                onClick={() => setShowTopUpModal(true)}
                className="cursor-pointer rounded-pill bg-white px-8 py-3 font-bold text-primary transition hover:bg-opacity-90"
              >
                Top Up
              </div>
              <div className="cursor-pointer rounded-pill border-2 border-white px-8 py-3 font-bold text-white transition hover:bg-white/10">
                Withdraw
              </div>
            </div>
          </div>
        </section>

        {/* Transaction History Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink">Transaction History</h2>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthStr = date.toISOString().slice(0, 7);
                const label = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                return (
                  <option key={monthStr} value={monthStr}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Summary Bar */}
          {monthTransactions.length > 0 && (
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-white p-6 border border-slate-200">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Total Credited</p>
                <p className="mt-2 text-2xl font-black text-green-600">+₹{monthCredit.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-semibold">Total Debited</p>
                <p className="mt-2 text-2xl font-black text-red-600">-₹{monthDebit.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}

          {/* Transactions List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} variant="list-item" />
              ))}
            </div>
          ) : txError ? (
            <ErrorCard message={txError} onRetry={loadTransactions} />
          ) : monthTransactions.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedByDate).map(([dateKey, txns]) => (
                <div key={dateKey}>
                  {/* Date Separator */}
                  <div className="mb-4 text-center">
                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full inline-block">
                      {txns[0].date || formatDate(txns[0].createdAt)}
                    </span>
                  </div>

                  {/* Transaction Rows */}
                  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    {txns.map((txn, index) => {
                      const isCredit = txn.type === 'CREDIT';
                      const Icon = isCredit ? ArrowUpRight : ArrowDownLeft;
                      const iconBg = isCredit ? 'bg-green-100' : 'bg-red-100';
                      const iconColor = isCredit ? 'text-green-600' : 'text-red-600';
                      const amountColor = isCredit ? 'text-green-600' : 'text-red-600';

                      return (
                        <div
                          key={txn.id}
                          className={`flex items-center justify-between gap-4 px-6 py-4 ${
                            index !== txns.length - 1 ? 'border-b border-slate-100' : ''
                          } hover:bg-slate-50 transition`}
                        >
                          {/* Left: Icon + Description + Date */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`${iconBg} rounded-full p-2.5 shrink-0`}>
                              <Icon className={`${iconColor} h-5 w-5`} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-ink">{txn.description}</p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {txn.orderId ? txn.orderId : (txn.date || '')}
                              </p>
                            </div>
                          </div>

                          {/* Right: Amount */}
                          <p className={`${amountColor} font-bold whitespace-nowrap text-lg`}>
                            {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Wallet}
              title="No transactions this month"
              subtitle="Your wallet transactions will appear here"
            />
          )}
        </section>
      </div>

      {/* Top Up Modal */}
      <TopUpWalletModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={(amount) => {
          setBalance((prev) => prev + amount);
          setShowTopUpModal(false);
        }}
      />
    </main>
  );
}

function TopUpWalletModal({ isOpen, onClose, onSuccess }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  async function handleAddFunds() {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`₹${amount.toLocaleString('en-IN')} added to your wallet!`);
      onSuccess(amount);
      setSelectedAmount(null);
      setCustomAmount('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet" maxWidth="sm">
      <div className="space-y-6">
        {/* Quick Select Chips */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Quick Select
          </label>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((amount) => (
              <div
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center font-bold transition ${
                  selectedAmount === amount
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-300 text-slate-700 hover:border-primary/50'
                }`}
              >
                ₹{amount.toLocaleString('en-IN')}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Custom Amount
          </label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Enter amount"
            min="1"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Add Button */}
        <div
          onClick={handleAddFunds}
          disabled={loading || (!selectedAmount && !customAmount)}
          className={`w-full rounded-pill px-4 py-2.5 text-center font-bold text-white transition ${
            loading || (!selectedAmount && !customAmount)
              ? 'bg-slate-400 cursor-not-allowed'
              : 'cursor-pointer bg-primary hover:bg-primary-dark'
          }`}
        >
          {loading ? 'Adding...' : 'Add to Wallet'}
        </div>
      </div>
    </Modal>
  );
}
