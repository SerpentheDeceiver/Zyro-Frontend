import { PackageSearch } from 'lucide-react';

export function EmptyState({
  icon: Icon = PackageSearch,
  title = 'Nothing here yet',
  subtitle,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  action,
  className = '',
}) {
  const helperText = subtitle || description;

  return (
    <div
      className={[
        'flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-soft animate-scale-in',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>

      <h2 className="text-lg font-bold text-ink">{title}</h2>

      {helperText ? <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{helperText}</p> : null}

      {action ? <div className="mt-6">{action}</div> : null}

      {!action && actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-pill bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          {ActionIcon ? <ActionIcon className="h-4 w-4" aria-hidden="true" /> : null}
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
