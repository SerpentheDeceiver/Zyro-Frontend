import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductById } from '../api/mock';
import { ordersAPI } from '../api';
import { Avatar, Badge, Button, Modal, SkeletonLoader } from '../components/common';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function loadProduct() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data || null);
      if (data) {
        const firstImage = data.imageUrl || data.primaryImageUrl || data.imageUrls?.[0] || '';
        setSelectedImage(firstImage);
      }
    } catch {
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    const merged = [
      product.imageUrl,
      product.primaryImageUrl,
      ...(Array.isArray(product.imageUrls) ? product.imageUrls : []),
    ].filter(Boolean);
    return [...new Set(merged)];
  }, [product]);

  if (loading) {
    return (
      <section className="space-y-5 animate-fade-slide-up">
        <SkeletonLoader variant="text" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SkeletonLoader variant="card" />
          <div className="space-y-4">
            <SkeletonLoader variant="text" />
            <SkeletonLoader variant="list-item" />
            <SkeletonLoader variant="list-item" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <ErrorCard message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        subtitle="This listing may have been removed or is no longer available."
        actionLabel="Back to Home"
        onAction={() => navigate('/home')}
      />
    );
  }

  const description = product.description || 'No description provided.';
  const longDescription = description.length > 220;
  const shownDescription = expanded || !longDescription ? description : `${description.slice(0, 220)}...`;
  const location = [product.city || product.locationCity, product.state || product.locationState]
    .filter(Boolean)
    .join(', ');
  const balance = Number(user?.walletBalance || 0);

  async function handleConfirmPurchase() {
    setConfirming(true);
    try {
      await ordersAPI.createOrder({
        id: product.id,
        title: product.title,
        price: product.price,
        sellerId: product.sellerId || `seller-${product.id}`,
        sellerName: product.sellerName || 'Seller',
      });
      toast.success('Order created. Funds are held in escrow.');
      setShowConfirmModal(false);
      navigate('/orders');
    } finally {
      setConfirming(false);
    }
  }

  return (
    <section className="space-y-5 animate-fade-slide-up">
      <nav className="text-sm text-slate-500">
        <Link to="/home" className="hover:text-primary">
          Home
        </Link>
        <span className="px-2 text-slate-300">{'>'}</span>
        <span>{product.category || 'Other'}</span>
        <span className="px-2 text-slate-300">{'>'}</span>
        <span className="font-medium text-slate-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="group overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={selectedImage || images[0]}
              alt={product.title}
              className="aspect-[4/3] w-full cursor-zoom-in object-cover transition duration-300 group-hover:scale-110"
            />
          </div>

          {images.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={[
                    'overflow-hidden rounded-xl border-2 bg-slate-100 transition',
                    selectedImage === image ? 'border-primary' : 'border-transparent hover:border-slate-300',
                  ].join(' ')}
                >
                  <img src={image} alt="" className="h-16 w-24 object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <h1 className="text-[28px] font-black leading-tight text-ink">{product.title}</h1>
          <h2 className="text-[32px] font-black leading-none text-primary">{formatINR(product.price)}</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Condition</p>
              <p className="mt-1 font-semibold text-ink">{(product.condition || 'GOOD').replaceAll('_', ' ')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-ink">{location || 'Remote'}</p>
            </div>
          </div>

          <div className="rounded-xl bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-ink">Buy with Escrow</p>
                <p className="mt-1 text-sm text-slate-600">
                  Zyro locks funds when the order is placed and releases them after delivery confirmation.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button fullWidth onClick={() => setShowConfirmModal(true)}>
              Buy with Escrow
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/chats')}>
              Chat with Seller
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Seller</p>
            <div className="mt-2 flex items-center gap-3">
              <Avatar name={product.sellerName || 'Seller'} size="md" />
              <div>
                <p className="font-semibold text-ink">{product.sellerName || 'Seller'}</p>
                {product.sellerVerified ? <Badge variant="verified">Verified</Badge> : null}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-ink">Description</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{shownDescription}</p>
            {longDescription ? (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            ) : null}
          </div>
        </aside>
      </div>

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Confirm Purchase" maxWidth="md">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-ink">{product.title}</p>
            <p className="mt-1 text-xl font-black text-primary">{formatINR(product.price)}</p>
          </div>

          <p className="text-sm text-slate-600">
            Your wallet will be debited {formatINR(product.price)}. Funds are held in escrow until you confirm delivery.
          </p>

          <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            Current wallet balance: {formatINR(balance)}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmModal(false)} disabled={confirming}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} loading={confirming}>
              Confirm Purchase
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

