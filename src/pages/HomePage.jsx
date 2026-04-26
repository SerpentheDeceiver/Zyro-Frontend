import { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Lock, Package, ShieldCheck, Wallet2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/mock';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import ProductCard from '../components/product/ProductCard.jsx';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Collectibles', 'Other'];

const ESCROW_STEPS = [
  { key: 'buy', label: 'Buy', icon: Package },
  { key: 'held', label: 'Held', icon: Lock },
  { key: 'release', label: 'Release', icon: Wallet2 },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStep, setActiveStep] = useState(0);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      setProducts(Array.isArray(response) ? response : []);
    } catch {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
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

  return (
    <div className="animate-fade-slide-up">
      <div className="space-y-10 pb-16 md:pb-6">
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
            <div className="inline-flex items-center gap-2 rounded-pill bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-slide-up">
              <ShieldCheck className="h-4 w-4" />
              Escrow-first marketplace
            </div>

            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-ink animate-fade-slide-up [animation-delay:150ms] md:text-5xl">
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

          <div className="animate-fade-slide-up [animation-delay:300ms]">
            <div className="animate-float-soft rounded-2xl bg-ink p-6 text-white shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Escrow Flow</p>

              <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
                {ESCROW_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === activeStep;

                  return (
                    <Fragment key={step.key}>
                      <div
                        className={[
                          'rounded-xl border p-3 text-center transition-all duration-300',
                          'bg-gradient-to-br from-primary/25 to-secondary/25',
                          isActive
                            ? 'border-secondary/70 shadow-[0_0_0_2px_rgba(6,182,212,0.3)]'
                            : 'border-white/10 opacity-80',
                        ].join(' ')}
                      >
                        <Icon className="mx-auto h-5 w-5" />
                        <p className="mt-1 text-sm font-semibold">{step.label}</p>
                      </div>

                      {index < ESCROW_STEPS.length - 1 ? (
                        <div className="flex justify-center">
                          <ArrowRight
                            className={[
                              'h-4 w-4 transition-all duration-300',
                              activeStep === index ? 'text-secondary animate-pulse' : 'text-slate-500',
                            ].join(' ')}
                          />
                        </div>
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-ink">Marketplace</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? 'Loading listings...'
                : `${filteredProducts.length} listing${filteredProducts.length === 1 ? '' : 's'} available`}
            </p>
          </div>

          <div className="flex w-full items-center justify-start overflow-x-auto pb-1 md:justify-center">
            <div className="inline-flex min-w-max gap-2">
              {CATEGORIES.map((category) => {
                const active = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={[
                      'rounded-pill px-4 py-2 text-sm font-semibold transition-colors duration-200',
                      active
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary',
                    ].join(' ')}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonLoader key={`product-skeleton-${index}`} variant="card" />
            ))}
          </div>
        ) : error ? (
          <ErrorCard message={error} onRetry={loadProducts} />
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
