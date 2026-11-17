import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';

export function useScenarios(filters = {}) {
  return useQuery({
    queryKey: ['scenarios', filters],
    queryFn: async () => {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.concept) params.concept = filters.concept;
      const { data } = await api.get('/scenarios', { params });
      return data.data; // unwrap { success, data, total, page, limit } envelope
    },
  });
}

export function useGenerateScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ topic, difficulty }) => {
      const { data } = await api.post('/scenarios/generate', { topic, difficulty });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });
}
