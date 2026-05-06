const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts[0][0].toUpperCase();
}

export function Avatar({ name = '', url, size = 'md', className = '' }) {
  const initials = getInitials(name);
  const sizeClass = sizeMap[size] || sizeMap.md;

  if (url) {
    return (
      <img
        src={url}
        alt={name || 'Avatar'}
        className={['rounded-full object-cover', sizeClass, className].filter(Boolean).join(' ')}
      />
    );
  }

  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full bg-indigo-600 font-semibold text-white',
        sizeClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={name || 'Avatar'}
    >
      {initials}
    </span>
  );
}

export default Avatar;
