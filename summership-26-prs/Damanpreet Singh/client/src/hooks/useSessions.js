import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await api.get('/sessions');
      return data.data; // unwrap { success, data, total, page, limit } envelope
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData) => {
      const { data } = await api.post('/sessions', sessionData);
      return data.data; 
    },
    onMutate: async (newSession) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] });
      const previousSessions = queryClient.getQueryData(['sessions']);
      
      // Optimistically update
      queryClient.setQueryData(['sessions'], (old) => {
        if (!old) return old;
        const optimisticSession = {
          id: `temp-${Date.now()}`,
          ...newSession,
          createdAt: new Date().toISOString(),
          // Placeholder values until server responds
          promptScore: 0,
        };
        return {
          ...old,
          data: [optimisticSession, ...(old.data || [])],
        };
      });
      
      return { previousSessions };
    },
    onError: (err, newSession, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(['sessions'], context.previousSessions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
