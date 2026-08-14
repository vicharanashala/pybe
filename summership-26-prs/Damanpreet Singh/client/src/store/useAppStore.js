import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      selectedScenario: null,
      activeResult: null,
      filters: { q: '', difficulty: '', concept: '' },
      auth: { token: null, user: null },

      setSelectedScenario: (scenario) =>
        set({ selectedScenario: scenario, activeResult: null }),

      setActiveResult: (result) =>
        set({ activeResult: result }),

      setFilters: (updater) =>
        set((state) => ({
          filters:
            typeof updater === 'function'
              ? updater(state.filters)
              : { ...state.filters, ...updater },
        })),

      resetFilters: () =>
        set({ filters: { q: '', difficulty: '', concept: '' } }),

      setAuth: (auth) => set({ auth }),
      logout: () => set({ auth: { token: null, user: null } }),
    }),
    {
      name: 'pybe-storage',
      // only persist auth and activeResult, optionally filters
      partialize: (state) => ({ auth: state.auth, activeResult: state.activeResult }),
    }
  )
);

export default useAppStore;
