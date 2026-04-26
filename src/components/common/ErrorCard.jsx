import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorCard — shown when a data-fetching page fails.
 * Props:
 *   message  — human-readable error text (default: "Something went wrong")
 *   onRetry  — callback to re-run the failed fetch
 */
export function ErrorCard({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="error-card animate-scale-in">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </span>

      <div>
        <h2 className="text-lg font-bold text-red-700">Oops!</h2>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-red-600">{message}</p>
      </div>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-pill bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      ) : null}
    </div>
  );
}

export default ErrorCard;
