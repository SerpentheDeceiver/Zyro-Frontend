import { useState } from 'react';
import { MessageCircle, ShieldCheck, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { chatAPI, ordersAPI } from '../api';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useProduct } from '../hooks/useProducts';
import { formatCurrency, productImage } from '../utils/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { isAuthenticated, user } = useAuth();
  const [buying, setBuying] = useState(false);
  const [chatting, setChatting] = useState(false);
  const navigate = useNavigate();

  if (loading) return <Loader label="Loading product" />;

  if (!product) {
    return (
      <main className="page-shell py-10">
        <div className="panel p-8 text-center">
          <h1 className="text-2xl font-black">Product not found</h1>
          <Link to="/" className="btn-primary mt-5">
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  const images = product.imageUrls?.length ? product.imageUrls : [productImage(product)];
  const isOwnListing = user?.id && user.id === product.sellerId;

  function requireLogin() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return false;
    }
    return true;
  }

  async function handleChat() {
    if (!requireLogin()) return;
    setChatting(true);
    try {
      const chat = await chatAPI.createChat(product.id);
      navigate(`/chat/${chat.id}`);
    } finally {
      setChatting(false);
    }
  }

  async function handleBuy() {
    if (!requireLogin()) return;
    if (isOwnListing) {
      toast.error('You cannot buy your own listing.');
      return;
    }

    setBuying(true);
    try {
      const order = await ordersAPI.createOrder(product);
      toast.success('Order created. Funds are held in escrow.');
      navigate('/orders', { state: { orderId: order.id } });
    } finally {
      setBuying(false);
    }
  }

  return (
    <main className="page-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section>
          <div className="overflow-hidden rounded-lg bg-slate-100 shadow-soft">
            <img src={productImage(product)} alt={product.title} className="aspect-[4/3] w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((image) => (
                <img key={image} src={image} alt="" className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <StatusBadge status={product.status || 'ACTIVE'} />
            <h1 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">{product.title}</h1>
            <p className="mt-3 text-4xl font-black text-primary">{formatCurrency(product.price)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="panel p-4">
              <p className="text-slate-500">Condition</p>
              <p className="mt-1 font-bold text-slate-950">{product.condition?.replace('_', ' ') || 'GOOD'}</p>
            </div>
            <div className="panel p-4">
              <p className="text-slate-500">Location</p>
              <p className="mt-1 font-bold text-slate-950">
                {[product.locationCity, product.locationState].filter(Boolean).join(', ') || 'Remote'}
              </p>
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-primary" size={22} />
              <div>
                <h2 className="font-black text-slate-950">Buy with Escrow</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Zyro locks funds when the order is placed and releases them after delivery confirmation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" loading={buying} onClick={handleBuy}>
              <ShoppingBag size={18} />
              Buy with Escrow
            </Button>
            <Button className="flex-1" variant="outline" loading={chatting} onClick={handleChat}>
              <MessageCircle size={18} />
              Chat with Seller
            </Button>
          </div>

          <div className="panel p-5">
            <h2 className="font-black text-slate-950">Seller</h2>
            <p className="mt-2 text-slate-700">{product.sellerName || 'Zyro seller'}</p>
          </div>

          <div className="panel p-5">
            <h2 className="font-black text-slate-950">Description</h2>
            <p className="mt-3 whitespace-pre-line text-slate-600">{product.description || 'No description added.'}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
