export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white animate-fade-in">
      {/* Logo with animated ring */}
      <div className="relative mb-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/5">
          <img src="/src/assets/logo/logo.svg" alt="Zyro Logo" className="h-12 w-auto object-contain brightness-0" />
        </div>
        {/* Animated loading ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />
      </div>

      {/* Loading text */}
      <p className="text-sm font-semibold text-slate-600 animate-pulse">Loading Zyro...</p>

      {/* CSS for additional animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
