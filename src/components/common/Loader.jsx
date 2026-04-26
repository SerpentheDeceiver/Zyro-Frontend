export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center animate-fade-in">
      <div className="flex items-center gap-3 rounded-pill bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-soft border border-slate-100">
        {/* Three-dot pulsing orbs */}
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 180}ms` }}
            />
          ))}
        </span>
        {label}…
      </div>
    </div>
  );
}
