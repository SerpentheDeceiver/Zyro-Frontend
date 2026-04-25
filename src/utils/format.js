export function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDate(value) {
  if (!value) return 'Recently';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function initials(name = 'Z') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'Z';
}

export function normalizePage(pageOrList) {
  if (Array.isArray(pageOrList)) return pageOrList;
  return pageOrList?.content || [];
}

export function productImage(product) {
  // Use local placeholder when the listing has no images.
  return product?.primaryImageUrl || product?.imageUrls?.[0] || '/placeholder.svg';
}
