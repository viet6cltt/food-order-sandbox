import { useState, useEffect } from 'react';
import { getRestaurantById } from '../features/restaurant/api';
import type { Restaurant } from '../features/home/components/RestaurantCard';

interface UseRestaurantResult {
  restaurant: Restaurant | null;
  loading: boolean;
  error: Error | null;
}

export default function useRestaurant(restaurantId: string | undefined): UseRestaurantResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setRestaurant(null);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRestaurantById(restaurantId);
        setRestaurant(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load restaurant'));
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurantId]);

  return { restaurant, loading, error };
}

