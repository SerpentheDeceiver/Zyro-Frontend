import { useState } from 'react';
import { PackageCheck } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Loader from '../components/common/Loader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency, formatDate } from '../utils/format';

function OrderCard({ order, onConfirm, allowConfirm }) {
  const [loading, setLoading] = useState(false);
  const canConfirm =
    allowConfirm && !order.buyerConfirmed && !['COMPLETED', 'CANCELLED'].includes(order.status);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm(order.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="panel p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.escrowStatus || order.status} />
            <span className="text-xs font-semibold text-slate-500">{order.orderNumber || order.id}</span>
          </div>
          <h2 className="mt-3 text-lg font-black text-slate-950">{order.productTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(order.createdAt)} - {order.sellerName || order.buyerName}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-2xl font-black text-slate-950">{formatCurrency(order.agreedPrice)}</p>
          {canConfirm && (
            <Button className="mt-3" loading={loading} onClick={handleConfirm}>
              <PackageCheck size={18} />
              Confirm Receipt
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function OrdersPage() {
  const { buying, selling, loading, confirmDelivery } = useOrders();
  const [tab, setTab] = useState('buying');
  const orders = tab === 'buying' ? buying : selling;

  if (loading) return <Loader label="Loading orders" />;

  return (
    <main className="page-shell py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Orders</h1>
          <p className="text-slate-500">Purchases, sales, and escrow status</p>
        </div>
        <div className="flex rounded-pill bg-slate-100 p-1">
          <button
            className={`rounded-pill px-5 py-2 text-sm font-bold ${tab === 'buying' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            onClick={() => setTab('buying')}
          >
            Buying
          </button>
          <button
            className={`rounded-pill px-5 py-2 text-sm font-bold ${tab === 'selling' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            onClick={() => setTab('selling')}
          >
            Selling
          </button>
        </div>
      </div>

      {orders.length ? (
        <div className="space-y-4">
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
        <EmptyState title="No orders yet" description="Escrow orders will appear here after purchase." />
      )}
    </main>
  );
}
