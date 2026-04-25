export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.svg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL}/uploads/${imagePath}`;
};

