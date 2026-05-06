import { useCallback, useEffect, useMemo, useState } from 'react';
import { productsAPI } from '../api';
import { normalizePage } from '../utils/format';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stableFilters = useMemo(() => filters, [filters.category, filters.search, filters.state]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getProducts({
        page: 0,
        size: 40,
        search: stableFilters.search || undefined,
        state: stableFilters.state && stableFilters.state !== 'All India' ? stableFilters.state : undefined,
        category: stableFilters.category && stableFilters.category !== 'All' ? stableFilters.category : undefined,
      });
      const items = normalizePage(response);
      const search = stableFilters.search?.toLowerCase();
      const category = stableFilters.category;
      const state = stableFilters.state;
      setProducts(
        items.filter((product) => {
          const matchesSearch = !search || product.title?.toLowerCase().includes(search);
          const matchesCategory = !category || category === 'All' || product.categoryName === category;
          const matchesState = !state || state === 'All India' || product.locationState === state;
          return matchesSearch && matchesCategory && matchesState;
        })
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, refetch: loadProducts };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const nextProduct = await productsAPI.getProduct(id);
        if (!cancelled) setProduct(nextProduct);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
