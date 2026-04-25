import { Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton.jsx';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../utils/constants';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const { products, loading } = useProducts({ category: activeCategory, search });

  function setCategory(category) {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') next.delete('category');
    else next.set('category', category);
    setSearchParams(next);
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell grid gap-8 py-10 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <ShieldCheck size={17} />
              Escrow-first marketplace
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              Buy and sell used goods with money held until delivery.
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">
              Browse listings, chat with sellers, place escrow-backed orders, and track wallet activity from one clean MVP.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/sell" className="btn-primary">
                Create listing
              </Link>
              <Link to="/orders" className="btn-outline">
                View orders
              </Link>
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-6 text-white shadow-soft">
            <p className="text-sm font-semibold text-cyan-200">Escrow flow</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-bold">
              <div className="rounded-lg bg-white/10 p-4">Buy</div>
              <div className="rounded-lg bg-white/10 p-4">Held</div>
              <div className="rounded-lg bg-white/10 p-4">Release</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Marketplace</h2>
            <p className="text-sm text-slate-500">{products.length} listings available</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="shrink-0 text-slate-400" size={18} />
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                type="button"
                variant={activeCategory === category ? 'primary' : 'ghost'}
                className="shrink-0 px-4 py-2"
                onClick={() => setCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="No listings found" description="Try a different category or search term." />
        )}
      </section>
    </main>
  );
}
