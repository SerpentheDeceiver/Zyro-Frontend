import { useState } from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatRupee(amount) {
  return `\u20B9${Number(amount || 0).toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const category = product?.category || product?.categoryName || 'Other';
  const city = product?.city || product?.locationCity || 'Remote';
  const imageUrl = product?.imageUrl || product?.primaryImageUrl || product?.imageUrls?.[0] || '';

  return (
    <article
      onClick={() => navigate(`/products/${product.id}`)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
        {imageError || !imageUrl ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
            <Camera className="h-7 w-7" />
            <p className="mt-2 text-xs font-medium">Image unavailable</p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-sm font-semibold text-ink">{product.title}</h3>
          <span className="shrink-0 rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Escrow
          </span>
        </div>

        <p className="mt-2 text-2xl font-black text-primary">{formatRupee(product.price)}</p>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{category}</span>
          <span className="text-right">{city}</span>
        </div>
      </div>
    </article>
  );
}
