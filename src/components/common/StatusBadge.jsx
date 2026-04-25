const styles = {
  HELD: 'bg-amber-100 text-amber-800',
  PAYMENT_HELD: 'bg-amber-100 text-amber-800',
  CREATED: 'bg-indigo-100 text-indigo-800',
  PENDING: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  RELEASED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
  DISPUTED: 'bg-rose-100 text-rose-800',
  FROZEN: 'bg-rose-100 text-rose-800',
  ACTIVE: 'bg-cyan-100 text-cyan-800',
  DRAFT: 'bg-slate-100 text-slate-700',
};

export default function StatusBadge({ status, children }) {
  const key = status || 'DRAFT';
  return (
    <span className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-bold ${styles[key] || styles.DRAFT}`}>
      {children || key.replaceAll('_', ' ')}
    </span>
  );
}
