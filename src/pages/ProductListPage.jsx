import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getProducts } from '../api/mock/index.js';
import ProductCard from '../components/product/ProductCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Collectibles', 'Other'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(
        (p) => (p.category || p.categoryName) === activeCategory
      );
    }

    // Search filter
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((p) =>
        (p.title || '').toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...result];
    if (sort === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      // newest first — by createdAt descending
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [products, activeCategory, search, sort]);

  return (
    <main className="page-shell min-h-screen animate-fade-slide-up">
      <div className="space-y-8 pb-16 md:pb-8">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-ink">Browse Marketplace</h1>
          <p className="text-sm text-slate-500">
            {loading
              ? 'Loading listings…'
              : `Showing ${filteredProducts.length} of ${products.length} listing${products.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Search + Sort Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="marketplace-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:min-w-[220px]">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              id="marketplace-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm font-semibold text-ink outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex w-full items-center overflow-x-auto pb-1">
          <div className="inline-flex min-w-max gap-2">
            {CATEGORIES.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  id={`cat-pill-${cat.toLowerCase()}`}
                  onClick={() => setActiveCategory(cat)}
                  className={[
                    'rounded-pill px-4 py-2 text-sm font-semibold transition-colors duration-200',
                    active
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary',
                  ].join(' ')}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={`skel-${i}`} variant="card" />
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
            subtitle="Try a different search term or category."
          />
        )}
      </div>
    </main>
  );
}
