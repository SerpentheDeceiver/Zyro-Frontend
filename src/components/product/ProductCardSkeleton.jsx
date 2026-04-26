export default function ProductCardSkeleton({ index = 0 }) {
  const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
  const delay = delays[index % delays.length];

  return (
    <div className={`panel overflow-hidden ${delay}`}>
      {/* Image placeholder */}
      <div className="aspect-[4/3] w-full animate-shimmer rounded-t-lg" />

      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="animate-shimmer h-3.5 w-3/4 rounded-full" />
            <div className="animate-shimmer h-3.5 w-1/2 rounded-full" />
          </div>
          <div className="animate-shimmer h-5 w-14 rounded-pill shrink-0" />
        </div>
        <div className="animate-shimmer h-5 w-1/3 rounded-full" />
        <div className="flex justify-between">
          <div className="animate-shimmer h-3 w-1/4 rounded-full" />
          <div className="animate-shimmer h-3 w-1/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
