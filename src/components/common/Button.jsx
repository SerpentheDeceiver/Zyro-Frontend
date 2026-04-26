import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary:
    'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/30 active:scale-95',
  secondary:
    'border border-primary bg-white text-primary hover:bg-primary/5 focus-visible:ring-primary/20 active:scale-95',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-200 active:scale-95',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-200 active:scale-95',
  outline:
    'border-2 border-primary text-primary hover:bg-primary/5 focus-visible:ring-primary/20 active:scale-95',
};

const sizeClasses = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  fullWidth = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-semibold',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-4',
        'disabled:cursor-not-allowed disabled:opacity-60',
        loading ? 'pointer-events-none' : '',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export default Button;
