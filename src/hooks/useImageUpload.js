import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const IMAGE_UPLOAD_CONFIGURED = Boolean(supabase);

/**
 * Hook for uploading images to Supabase Storage
 * @returns {Object} { uploading, error, uploadImage, clearError }
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setError(null);

    // Validate Supabase is configured
    if (!supabase) {
      setError('Image upload is not configured');
      return null;
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return null;
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError('Image must be smaller than 5MB');
      return null;
    }

    try {
      setUploading(true);

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const ext = file.name.split('.').pop();
      const fileName = `products/${timestamp}-${randomId}.${ext}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        setError(uploadError.message || 'Failed to upload image');
        return null;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err?.message || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const clearError = () => setError(null);

  return { uploading, error, uploadImage, clearError };
}

export default useImageUpload;
