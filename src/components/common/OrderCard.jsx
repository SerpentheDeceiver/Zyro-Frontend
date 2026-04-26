import { useState } from 'react';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal.jsx';
import StatusBadge from './StatusBadge.jsx';
import { formatCurrency, formatDate } from '../../utils/format';

export default function OrderCard({ order, onConfirm, allowConfirm = false }) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const canConfirm =
    allowConfirm &&
    !order.buyerConfirmed &&
    !['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(order.status);

  async function handleConfirmReceipt() {
    setIsConfirming(true);
    try {
      await onConfirm(order.id);
      setShowConfirmModal(false);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <>
      <div className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Status Badge + Order ID */}
          <div className="flex items-center gap-3 min-w-0">
            <StatusBadge
              status={order.escrowStatus || order.status}
              pulse={order.status === 'HELD'}
            />
            <span className="truncate text-xs font-medium text-slate-500">
              {order.orderNumber || order.id}
            </span>
          </div>

          {/* Middle: Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-bold text-ink">{order.productTitle}</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatDate(order.createdAt)} - {order.sellerName || order.buyerName}
            </p>
          </div>

          {/* Right: Amount + Action */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="font-bold text-ink">{formatCurrency(order.agreedPrice)}</p>
            </div>

            {canConfirm ? (
              <div
                onClick={() => setShowConfirmModal(true)}
                className="cursor-pointer rounded-pill bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Confirm Receipt
              </div>
            ) : order.status === 'RELEASED' || order.status === 'COMPLETED' ? (
              <div
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                View Details <ChevronRight className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isConfirming && setShowConfirmModal(false)}
        title="Confirm Receipt"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg bg-blue-50 p-4">
            <ShoppingBag className="h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-semibold text-ink">{order.productTitle}</p>
              <p className="mt-1 text-slate-600">
                Please confirm that you have received this item in good condition.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div
              onClick={handleConfirmReceipt}
              disabled={isConfirming}
              className={`w-full rounded-pill px-4 py-2.5 text-center font-semibold text-white transition ${
                isConfirming
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'cursor-pointer bg-primary hover:bg-primary-dark'
              }`}
            >
              {isConfirming ? 'Confirming...' : 'Confirm Receipt'}
            </div>
            <div
              onClick={() => setShowConfirmModal(false)}
              className="rounded-pill border-2 border-slate-300 px-4 py-2.5 text-center font-semibold text-slate-700 cursor-pointer transition hover:bg-slate-50"
            >
              Cancel
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
