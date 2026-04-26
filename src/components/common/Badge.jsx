const variantMap = {
  held: {
    wrap: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500',
    label: 'Held',
  },
  released: {
    wrap: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Released',
  },
  cancelled: {
    wrap: 'bg-slate-100 text-slate-700 ring-slate-200',
    dot: 'bg-slate-400',
    label: 'Cancelled',
  },
  disputed: {
    wrap: 'bg-rose-50 text-rose-800 ring-rose-200',
    dot: 'bg-rose-500',
    label: 'Disputed',
  },
  escrow: {
    wrap: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
    dot: 'bg-primary',
    label: 'Escrow',
  },
  verified: {
    wrap: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Verified',
  },
};

export function Badge({ variant = 'escrow', children, pulse, size = 'sm', className = '' }) {
  const key = (variant || 'escrow').toLowerCase();
  const config = variantMap[key] || variantMap.escrow;
  const withPulse = typeof pulse === 'boolean' ? pulse : key === 'held';
  const isLarge = size === 'lg';

  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-pill font-semibold ring-1',
        isLarge ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs',
        config.wrap,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={['relative inline-flex shrink-0', isLarge ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'].join(' ')}>
        {withPulse ? (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring ${config.dot}`} />
        ) : null}
        <span className={['relative inline-flex rounded-full', isLarge ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5', config.dot].join(' ')} />
      </span>
      {children || config.label}
    </span>
  );
}

export default Badge;
