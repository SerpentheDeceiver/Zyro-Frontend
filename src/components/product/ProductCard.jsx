import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatCurrency } from '../../utils/format';
import { getImageUrl } from '../../utils/helpers';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="panel group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(product?.primaryImageUrl || product?.imageUrls?.[0])}
          alt={product.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-950">{product.title}</h3>
          <StatusBadge status="HELD">Escrow</StatusBadge>
        </div>
        <p className="mt-3 text-xl font-black text-slate-950">{formatCurrency(product.price)}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{product.categoryName || 'Marketplace'}</span>
          <span>{product.locationCity || 'Remote'}</span>
        </div>
      </div>
    </Link>
  );
}
