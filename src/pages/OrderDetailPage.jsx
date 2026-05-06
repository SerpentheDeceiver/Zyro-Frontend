import { useEffect, useState } from 'react';
import { Shield, AlertCircle, ChevronRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import StatusTimeline from '../components/common/StatusTimeline.jsx';
import { ordersAPI } from '../api';
import { formatCurrency, formatDate } from '../utils/format';

function getEscrowCardConfig(status) {
  switch (status) {
    case 'HELD':
      return {
        title: 'Funds Held in Escrow',
        description:
          'Your payment is securely held by Zyro. Confirm receipt once you receive and are satisfied with the item — then payment is released to the seller.',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-700',
      };
    case 'RELEASED':
      return {
        title: 'Payment Released to Seller',
        description:
          'Payment has been released to the seller. If you need help, contact support with your order ID.',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-700',
      };
    case 'REFUNDED':
      return {
        title: 'Refund Processed',
        description:
          'Your refund has been processed. It may take some time to reflect depending on the method used.',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'text-slate-700',
      };
    case 'FROZEN':
    case 'DISPUTED':
      return {
        title: 'Escrow Frozen — Under Review',
        description:
          'A dispute has been raised. Our team is reviewing the issue. Funds remain held in escrow until the dispute is resolved.',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        icon: 'text-rose-700',
      };
    default:
      return {
        title: 'Escrow Status',
        description: 'Order status information is unavailable.',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'text-slate-700',
      };
  }
}

function buildTimeline(orderStatus, createdAt) {
  const base = [
    { label: 'Order Placed' },
    { label: 'Payment Held' },
    { label: 'Item Shipped' },
    { label: 'Delivery Confirmed' },
    { label: 'Payment Released' },
  ];

  let activeIndex = 1;
  if (orderStatus === 'HELD') activeIndex = 1;
  if (orderStatus === 'RELEASED') activeIndex = 4;
  if (orderStatus === 'DISPUTED' || orderStatus === 'FROZEN') activeIndex = 1;
  if (orderStatus === 'CANCELLED' || orderStatus === 'REFUNDED') activeIndex = 1;

  return base.map((step, index) => ({
    ...step,
    done: index < activeIndex,
    active: index === activeIndex,
    date: index === 0 ? formatDate(createdAt) : undefined,
  }));
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [disputing, setDisputing] = useState(false);
  const [order, setOrder] = useState(null);
  const isValidId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id ?? '');
  const [loading, setLoading] = useState(isValidId);

  useEffect(() => {
    if (!isValidId) return;
    let cancelled = false;

    async function loadOrder() {
      setLoading(true);
      try {
        const nextOrder = await ordersAPI.getOrder(id);
        if (!cancelled) setOrder(nextOrder);
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrder();
    setDisputeReason('');
    setShowConfirmModal(false);
    setShowDisputeModal(false);
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page-shell py-8">
        <p className="text-sm font-semibold text-slate-500">Loading order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="page-shell py-8">
        <EmptyState
          title="Order not found"
          subtitle="The order you're looking for doesn't exist."
        />
      </main>
    );
  }

  const escrow = getEscrowCardConfig(order.status);
  const timeline = buildTimeline(order.status, order.createdAt);
  const showActions = order.status === 'HELD';

  async function handleConfirmReceipt() {
    setConfirming(true);
    try {
      const updated = await ordersAPI.confirmDelivery(order.id);
      setOrder(updated);
      toast.success('Receipt confirmed. Payment released to seller.');
      setShowConfirmModal(false);
    } finally {
      setConfirming(false);
    }
  }

  async function handleRaiseDispute() {
    if (!disputeReason.trim()) return;
    setDisputing(true);
    try {
      await ordersAPI.raiseDispute(order.id, disputeReason);
      setOrder((prev) => ({ ...prev, status: 'DISPUTED', escrowStatus: 'FROZEN' }));
      toast.success('Dispute raised. Escrow is frozen.');
      setShowDisputeModal(false);
    } finally {
      setDisputing(false);
    }
  }

  return (
    <main className="page-shell py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/orders" className="text-primary hover:underline">
            Orders
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="font-mono text-slate-600">{order.orderId}</span>
        </nav>

        {/* Top Section */}
        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-mono text-3xl font-black tracking-tight text-ink sm:text-4xl">
                {order.orderId}
              </h1>
              <p className="mt-2 text-slate-500">{order.productTitle}</p>
            </div>
            <Badge size="lg" variant={order.status.toLowerCase()} pulse={order.status === 'HELD'} />
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Product</p>
              <p className="font-bold text-ink">{order.productTitle}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Seller</p>
              <p className="font-bold text-ink">{order.sellerName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date placed</p>
              <p className="font-bold text-ink">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Amount</p>
              <p className="text-2xl font-black text-primary">{formatCurrency(order.amount)}</p>
            </div>
          </div>
        </section>

        {/* Escrow Status Card */}
        <section className="flex justify-center">
          <div className={['w-full max-w-2xl rounded-2xl border-2 p-8 text-center shadow-soft', escrow.bg, escrow.border].join(' ')}>
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-black/5">
              <Shield className={[escrow.icon, 'h-12 w-12'].join(' ')} />
            </div>
            <h2 className={[escrow.icon, 'mt-5 text-2xl font-black'].join(' ')}>{escrow.title}</h2>
            <p className="mt-2 text-slate-700">{escrow.description}</p>
          </div>
        </section>

        {/* Order Timeline */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-ink">Order Timeline</h3>
          <StatusTimeline steps={timeline} />
        </section>

        {/* Action Buttons */}
        {showActions ? (
          <section className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="flex-1 rounded-pill bg-primary px-6 py-3 text-center font-bold text-white transition hover:bg-primary-dark"
            >
              Confirm Receipt
            </button>
            <button
              type="button"
              onClick={() => setShowDisputeModal(true)}
              className="flex-1 rounded-pill border-2 border-rose-500 px-6 py-3 text-center font-bold text-rose-600 transition hover:bg-rose-50"
            >
              Raise Dispute
            </button>
          </section>
        ) : order.status === 'RELEASED' || order.status === 'CANCELLED' ? (
          <section className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
            <div>
              <p className="font-semibold text-ink">
                {order.status === 'RELEASED' ? 'No action required' : 'No action available'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {order.status === 'RELEASED'
                  ? 'Payment has already been released to the seller.'
                  : 'This order is cancelled and can’t be changed.'}
              </p>
            </div>
          </section>
        ) : null}

        {order.status === 'DISPUTED' ? (
          <section className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
            <div>
              <p className="font-semibold text-rose-900">Dispute under review</p>
              <p className="mt-1 text-sm text-rose-800">
                Escrow is frozen while the issue is reviewed.
              </p>
            </div>
          </section>
        ) : null}
      </div>

      {/* Confirm Receipt Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !confirming && setShowConfirmModal(false)}
        title="Confirm Receipt"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Only confirm if you have received and are satisfied with the item.
            </p>
            <p className="mt-2 text-sm text-amber-800">
              Once confirmed, payment is released to the seller and cannot be reversed.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 rounded-pill border-2 border-slate-300 px-4 py-2.5 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReceipt}
              disabled={confirming}
              className={[
                'flex-1 rounded-pill px-4 py-2.5 text-center font-semibold text-white transition',
                confirming ? 'cursor-not-allowed bg-slate-400' : 'bg-primary hover:bg-primary-dark',
              ].join(' ')}
            >
              {confirming ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Raise Dispute Modal */}
      <Modal
        isOpen={showDisputeModal}
        onClose={() => !disputing && setShowDisputeModal(false)}
        title="Raise Dispute"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Describe the issue</label>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDisputeModal(false)}
              className="flex-1 rounded-pill border-2 border-slate-300 px-4 py-2.5 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRaiseDispute}
              disabled={disputing || !disputeReason.trim()}
              className={[
                'flex-1 rounded-pill px-4 py-2.5 text-center font-semibold text-white transition',
                disputing || !disputeReason.trim()
                  ? 'cursor-not-allowed bg-slate-400'
                  : 'bg-rose-600 hover:bg-rose-700',
              ].join(' ')}
            >
              {disputing ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
