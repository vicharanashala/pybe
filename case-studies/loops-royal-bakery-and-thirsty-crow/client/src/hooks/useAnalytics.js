import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics');
      return data.data; // unwrap { success, data } envelope
    },
  });
}
