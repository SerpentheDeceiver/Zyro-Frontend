import { useEffect, useMemo, useReducer, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatAPI, ordersAPI, productsAPI } from '../api';
import { Avatar, Button, Modal, SkeletonLoader } from '../components/common';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

const initialOrderState = { step: 'idle', error: null };

function orderReducer(state, action) {
  switch (action.type) {
    case 'OPEN_CONFIRM':    return { step: 'confirming', error: null };
    case 'CONFIRM_PURCHASE':return { step: 'processing', error: null };
    case 'PURCHASE_SUCCESS':return { step: 'success',    error: null };
    case 'PURCHASE_ERROR':  return { step: 'error',      error: action.error };
    case 'RESET':           return initialOrderState;
    default:                return state;
  }
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [orderState, dispatch] = useReducer(orderReducer, initialOrderState);
  const showConfirmModal = orderState.step !== 'idle' && orderState.step !== 'success';
  const confirming = orderState.step === 'processing';

  async function loadProduct() {
    setLoading(true);
    setError(null);
    try {
      const data = await productsAPI.getProduct(id);
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

  // Escape key closes lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    function handleEscape(e) {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft')  setLightboxIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen]);

  const images = useMemo(() => {
    if (!product) return [];
    const merged = [
      product.imageUrl,
      product.primaryImageUrl,
      ...(Array.isArray(product.imageUrls) ? product.imageUrls : []),
    ].filter(Boolean);
    return [...new Set(merged)];
  }, [product]);

  function openLightbox(index) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

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

  if (error) return <ErrorCard message={error} onRetry={loadProduct} />;

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
    dispatch({ type: 'CONFIRM_PURCHASE' });
    try {
      await ordersAPI.createOrder({
        id: product.id,
        title: product.title,
        price: product.price,
        sellerId: product.sellerId || `seller-${product.id}`,
        sellerName: product.sellerName || 'Seller',
      });
      dispatch({ type: 'PURCHASE_SUCCESS' });
      toast.success('Order created. Funds are held in escrow.');
      dispatch({ type: 'RESET' });
      navigate('/orders');
    } catch (err) {
      dispatch({ type: 'PURCHASE_ERROR', error: err?.message || 'Failed to create order' });
      toast.error('Failed to create order');
    }
  }

  async function handleChatWithSeller() {
    try {
      const chat = await chatAPI.createChat(product.id);
      navigate(chat?.id ? `/chats/${chat.id}` : '/chats');
    } catch {
      toast.error('Unable to start chat right now');
    }
  }

  return (
    <section className="space-y-5 animate-fade-slide-up">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link to="/home" className="hover:text-indigo-600">Home</Link>
        <span className="px-2 text-slate-300">{'>'}</span>
        <span>{product.category || 'Other'}</span>
        <span className="px-2 text-slate-300">{'>'}</span>
        <span className="font-medium text-slate-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT: Images + Seller Card */}
        <div className="space-y-4">
          <div
            className="group overflow-hidden rounded-2xl bg-slate-100 cursor-zoom-in"
            onClick={() => openLightbox(images.indexOf(selectedImage) >= 0 ? images.indexOf(selectedImage) : 0)}
          >
            <img
              src={selectedImage || images[0]}
              alt={product.title}
              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, idx) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={[
                    'overflow-hidden rounded-xl border-2 bg-slate-100 transition shrink-0',
                    selectedImage === image ? 'border-indigo-600' : 'border-transparent hover:border-slate-300',
                  ].join(' ')}
                >
                  <img src={image} alt="" className="h-16 w-24 object-cover" onClick={(e) => { e.stopPropagation(); openLightbox(idx); }} />
                </button>
              ))}
            </div>
          )}

          {/* Seller Card — below images on the left */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Seller</p>
            <div className="flex items-center gap-3">
              <Avatar name={product.sellerName || 'Seller'} size="md" />
              <div>
                <p className="font-semibold text-gray-900">{product.sellerName || 'Seller'}</p>
                {product.sellerVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Verified
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Member</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Details, Buttons, Description */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <h1 className="text-[28px] font-black leading-tight text-gray-900">{product.title}</h1>
          <h2 className="text-[32px] font-black leading-none text-indigo-600">{formatINR(product.price)}</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Condition</p>
              <p className="mt-1 font-semibold text-gray-900">{(product.condition || 'GOOD').replaceAll('_', ' ')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-gray-900">{location || 'Remote'}</p>
            </div>
          </div>

          {/* Escrow Info */}
          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-indigo-600" />
              <div>
                <p className="font-bold text-gray-900">Buy with Escrow</p>
                <p className="mt-1 text-sm text-slate-600">
                  Zyro locks funds when the order is placed and releases them after delivery confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button fullWidth onClick={() => dispatch({ type: 'OPEN_CONFIRM' })}>
              Buy with Escrow
            </Button>
            <Button variant="secondary" fullWidth onClick={handleChatWithSeller}>
              Chat with Seller
            </Button>
          </div>

          {/* Description — right below the buttons */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-gray-900">Description</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{shownDescription}</p>
            {longDescription && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && lightboxIndex > 0 && (
            <button
              type="button"
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i - 1); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <img
            src={images[lightboxIndex] || selectedImage}
            alt={product.title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && lightboxIndex < images.length - 1 && (
            <button
              type="button"
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i + 1); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                  className={`h-2 w-2 rounded-full transition ${idx === lightboxIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Purchase Confirm Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => dispatch({ type: 'RESET' })} title="Confirm Purchase" maxWidth="md">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-gray-900">{product.title}</p>
            <p className="mt-1 text-xl font-black text-indigo-600">{formatINR(product.price)}</p>
          </div>

          <p className="text-sm text-slate-600">
            Your wallet will be debited {formatINR(product.price)}. Funds are held in escrow until you confirm delivery.
          </p>

          <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
            Current wallet balance: {formatINR(balance)}
          </div>

          {orderState.step === 'error' && (
            <p className="text-sm text-red-600">{orderState.error}</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => dispatch({ type: 'RESET' })} disabled={confirming}>
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
