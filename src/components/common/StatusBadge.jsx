const CONFIG = {
  HELD:         { bg: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500'   },
  PAYMENT_HELD: { bg: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500'   },
  CREATED:      { bg: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500'  },
  PENDING:      { bg: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500'  },
  COMPLETED:    { bg: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  RELEASED:     { bg: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  CANCELLED:    { bg: 'bg-rose-100 text-rose-800',     dot: 'bg-rose-500'    },
  DISPUTED:     { bg: 'bg-rose-100 text-rose-800',     dot: 'bg-rose-500'    },
  FROZEN:       { bg: 'bg-rose-100 text-rose-800',     dot: 'bg-rose-500'    },
  ACTIVE:       { bg: 'bg-cyan-100 text-cyan-800',     dot: 'bg-cyan-500'    },
  DRAFT:        { bg: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400'   },
};

export default function StatusBadge({ status, children, pulse = false }) {
  const key = status || 'DRAFT';
  const { bg, dot } = CONFIG[key] || CONFIG.DRAFT;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold ${bg}`}>
      {/* Pulse-ring dot for live statuses */}
      <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
        {pulse && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring ${dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
      {children || key.replaceAll('_', ' ')}
    </span>
  );
}
