export default function ProductCardSkeleton() {
  return (
    <div className="panel animate-pulse overflow-hidden">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="p-4">
        <div className="mb-3 h-4 w-3/4 rounded bg-slate-200" />
        <div className="mb-2 h-6 w-1/2 rounded bg-slate-200" />
        <div className="mb-2 h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
      </div>
    </div>
  );
}

