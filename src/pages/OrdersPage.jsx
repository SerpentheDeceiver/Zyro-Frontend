import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import OrderCard from '../components/common/OrderCard.jsx';
import { useOrders } from '../hooks/useOrders';
import { ordersAPI } from '../api';
import { formatCurrency, formatDate } from '../utils/format';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { buying, selling, loading, error: ordersError, refetch, confirmDelivery } = useOrders();
  const [tab, setTab] = useState('buying');
  const [walletHistory, setWalletHistory] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  async function loadWalletHistory() {
    setWalletLoading(true);
    setWalletError(null);
    try {
      const history = await ordersAPI.getWalletHistory();
      setWalletHistory(history || []);
    } catch {
      setWalletError('Failed to load wallet history.');
    } finally {
      setWalletLoading(false);
    }
  }

  useEffect(() => {
    loadWalletHistory();
  }, []);

  const orders = tab === 'buying' ? buying : selling;

  return (
    <main className="page-shell py-8 animate-fade-slide-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink">Orders</h1>
          <p className="mt-1 text-slate-500">Purchases, sales, and escrow status</p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex rounded-pill bg-slate-100 p-1">
          <div
            onClick={() => setTab('buying')}
            className={`rounded-pill px-5 py-2 text-sm font-bold cursor-pointer transition ${
              tab === 'buying' ? 'bg-white text-primary shadow-soft' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buying
          </div>
          <div
            onClick={() => setTab('selling')}
            className={`rounded-pill px-5 py-2 text-sm font-bold cursor-pointer transition ${
              tab === 'selling' ? 'bg-white text-primary shadow-soft' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selling
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mb-12">
        <h2 className="mb-4 text-lg font-bold text-ink">Your Orders</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="list-item" />
            ))}
          </div>
        ) : ordersError ? (
          <ErrorCard message="Failed to load orders." onRetry={refetch} />
        ) : orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onConfirm={confirmDelivery}
                allowConfirm={tab === 'buying'}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            subtitle={
              tab === 'buying'
                ? 'Start shopping to see your purchases here'
                : 'Your listings will appear here once sold'
            }
            actionLabel="Browse Marketplace"
            onAction={() => navigate('/products')}
          />
        )}
      </div>

      {/* Wallet History Section */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-ink">Wallet History</h2>

        {walletLoading ? (
          <div className="space-y-2 bg-white rounded-lg border border-slate-200 p-4">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="list-item" />
            ))}
          </div>
        ) : walletError ? (
          <ErrorCard message={walletError} onRetry={loadWalletHistory} />
        ) : walletHistory.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {walletHistory.map((transaction, index) => (
              <WalletHistoryRow
                key={transaction.id}
                transaction={transaction}
                isAlternate={index % 2 === 1}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No wallet transactions yet"
            subtitle="Your wallet transactions will appear here"
          />
        )}
      </div>
    </main>
  );
}

function WalletHistoryRow({ transaction, isAlternate }) {
  const isCredit = transaction.type === 'CREDIT';
  const Icon = isCredit ? ArrowUp : ArrowDown;
  const iconBgColor = isCredit ? 'bg-green-100' : 'bg-red-100';
  const iconColor = isCredit ? 'text-green-600' : 'text-red-600';
  const amountColor = isCredit ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={`flex items-center justify-between gap-4 px-6 py-4 ${
        isAlternate ? 'bg-slate-50' : 'bg-white'
      } transition hover:bg-slate-100`}
    >
      {/* Icon + Description */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`${iconBgColor} rounded-full p-2.5 shrink-0`}>
          <Icon className={`${iconColor} h-5 w-5`} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{transaction.description}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>

      {/* Amount */}
      <p className={`${amountColor} font-bold whitespace-nowrap`}>
        {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}
