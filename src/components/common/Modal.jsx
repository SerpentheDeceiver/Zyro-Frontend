import { X } from 'lucide-react';

const maxWidthMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className = '',
  closeOnBackdrop = true,
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
    >
      <div
        className={[
          'relative w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-soft animate-scale-in',
          maxWidthMap[maxWidth] || maxWidthMap.md,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {title ? <h3 className="pr-10 text-lg font-bold text-ink">{title}</h3> : null}
        <div className={title ? 'mt-4' : ''}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
