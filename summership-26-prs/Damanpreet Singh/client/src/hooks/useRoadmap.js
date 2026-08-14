import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';

export function useRoadmap() {
  return useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const { data } = await api.get('/roadmap');
      return data.data; // unwrap { success, data } envelope
    },
  });
}
