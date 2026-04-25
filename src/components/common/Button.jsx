const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

export default function Button({ variant = 'primary', loading = false, className = '', children, ...props }) {
  return (
    <button className={`${variants[variant] || variants.primary} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
