import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Lock, Package, ShieldCheck, Wallet2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { USE_MOCK } from '../api/config';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { normalizePage } from '../utils/format';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const MOCK_CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Collectibles', 'Other'];

const ESCROW_STEPS = [
  { key: 'buy',     label: 'Buy',     icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { key: 'held',    label: 'Held',    icon: Lock,    color: 'text-amber-600',  bg: 'bg-amber-100'  },
  { key: 'release', label: 'Release', icon: Wallet2, color: 'text-emerald-600',bg: 'bg-emerald-100'},
];

export default function HomePage() {
  const navigate = useNavigate();
  const [location] = useLocalStorage('zyro_location', 'All India');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [activeStep, setActiveStep] = useState(0);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getProducts({
        page: 0,
        size: 40,
        state: location && location !== 'All India' ? location : undefined,
      });
      setProducts(normalizePage(response));
    } catch {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (USE_MOCK) return;
    productsAPI.getCategories()
      .then((items) => setCategories(['All', ...items.filter((item) => item.isActive !== false).map((item) => item.name)]))
      .catch(() => setCategories(['All']));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ESCROW_STEPS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((product) => (product.category || product.categoryName) === activeCategory);
  }, [activeCategory, products]);

  const handleCategorySelect = useCallback((cat) => setActiveCategory(cat), []);

  const handleProductClick = useCallback((id) => navigate(`/products/${id}`), [navigate]);

  return (
    <div className="animate-fade-slide-up">
      <div className="space-y-10 pb-16 md:pb-6">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(17,24,39,0.08)_1px,transparent_0)] [background-size:20px_20px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(99,102,241,0.05),transparent_40%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 animate-fade-slide-up">
                <ShieldCheck className="h-4 w-4" />
                Escrow-first marketplace
              </div>

              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-gray-900 animate-fade-slide-up [animation-delay:150ms] md:text-5xl">
                Buy and sell used goods with money held until delivery.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 animate-fade-slide-up [animation-delay:300ms]">
                Browse listings, chat with sellers, place escrow-backed orders, and track wallet activity.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 animate-fade-slide-up [animation-delay:450ms]">
                <Link to="/create-listing">
                  <Button variant="primary" icon={ArrowRight}>
                    Create listing
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="secondary">View orders</Button>
                </Link>
              </div>
            </div>

            {/* Lighter Escrow Flow Card */}
            <div className="animate-fade-slide-up [animation-delay:300ms]">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Escrow Flow</p>

                <div className="mt-5 flex items-center gap-3">
                  {ESCROW_STEPS.map((escrowStep, index) => {
                    const Icon = escrowStep.icon;
                    const isActive = index === activeStep;

                    return (
                      <Fragment key={escrowStep.key}>
                        <div
                          className={[
                            'flex-1 rounded-xl border-2 p-4 text-center transition-all duration-300',
                            isActive
                              ? `border-current ${escrowStep.bg} shadow-sm scale-105`
                              : 'border-slate-200 bg-white opacity-70',
                          ].join(' ')}
                        >
                          <Icon className={`mx-auto h-6 w-6 ${isActive ? escrowStep.color : 'text-slate-400'}`} />
                          <p className={`mt-1.5 text-sm font-bold ${isActive ? escrowStep.color : 'text-slate-500'}`}>
                            {escrowStep.label}
                          </p>
                        </div>

                        {index < ESCROW_STEPS.length - 1 ? (
                          <ArrowRight
                            className={[
                              'h-4 w-4 shrink-0 transition-all duration-300',
                              activeStep === index ? 'text-indigo-500 animate-pulse' : 'text-slate-300',
                            ].join(' ')}
                          />
                        ) : null}
                      </Fragment>
                    );
                  })}
                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Funds are held safely until buyer confirms delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Marketplace</h2>
            <span className="text-sm text-slate-500">
              {loading
                ? 'Loading...'
                : `${filteredProducts.length} listing${filteredProducts.length === 1 ? '' : 's'} available`}
            </span>
          </div>

          <div className="flex w-full items-center overflow-x-auto pb-1">
            <div className="inline-flex min-w-max gap-2">
              {categories.map((category) => {
                const active = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700',
                    ].join(' ')}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={`product-skeleton-${index}`} variant="card" />
              ))}
            </div>
          ) : error ? (
            <ErrorCard message={error} onRetry={loadProducts} />
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No listings found"
              subtitle="Try switching categories or check back soon for new items."
            />
          )}
        </section>
      </div>
    </div>
  );
}
