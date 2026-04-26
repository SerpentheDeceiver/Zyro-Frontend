function SkeletonBlock({ className = '' }) {
  return <div className={['animate-shimmer rounded-md', className].filter(Boolean).join(' ')} />;
}

export function SkeletonLoader({ variant = 'card', className = '' }) {
  if (variant === 'text') {
    return (
      <div className={['space-y-2', className].filter(Boolean).join(' ')}>
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-2/3" />
      </div>
    );
  }

  if (variant === 'avatar') {
    return <SkeletonBlock className={['h-10 w-10 rounded-full', className].filter(Boolean).join(' ')} />;
  }

  if (variant === 'list-item') {
    return (
      <div className={['flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3', className].filter(Boolean).join(' ')}>
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-2/3" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === 'full-page') {
    return (
      <div className={['space-y-4 p-4 sm:p-6', className].filter(Boolean).join(' ')}>
        <SkeletonBlock className="h-8 w-1/3" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-full-page-${index}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <SkeletonBlock className="h-40 w-full rounded-lg" />
              <div className="mt-4 space-y-2">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={['rounded-lg border border-slate-200 bg-white p-4 shadow-soft', className].filter(Boolean).join(' ')}>
      <SkeletonBlock className="h-44 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default SkeletonLoader;
