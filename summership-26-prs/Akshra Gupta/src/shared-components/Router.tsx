import React, { createContext, useContext, useState, useEffect } from 'react';

export type Route = 'home' | 'learning' | 'test' | 'coding' | 'gadgets' | 'profile' | 'settings';

interface RouterContextType {
  currentRoute: Route;
  params: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [params, setParams] = useState<Record<string, string>>({});

  // Sync state with URL hash updates
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // strip hash symbol '#'
      if (!hash) {
        setCurrentRoute('home');
        setParams({});
        return;
      }

      const [routePart, queryPart] = hash.split('?');
      const route = routePart as Route;
      
      const queryParams: Record<string, string> = {};
      if (queryPart) {
        const pairs = queryPart.split('&');
        for (const pair of pairs) {
          const [key, value] = pair.split('=');
          if (key && value) {
            queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        }
      }

      // Check if hash matches a valid route, otherwise fallback to home
      const validRoutes: Route[] = ['home', 'learning', 'test', 'coding', 'gadgets', 'profile', 'settings'];
      if (validRoutes.includes(route)) {
        setCurrentRoute(route);
        setParams(queryParams);
      } else {
        // Fallback for invalid hashes
        window.location.hash = 'home';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: Route, newParams: Record<string, string> = {}) => {
    let queryStr = '';
    const keys = Object.keys(newParams);
    if (keys.length > 0) {
      queryStr = '?' + keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(newParams[k])}`).join('&');
    }
    window.location.hash = `${route}${queryStr}`;
  };

  return (
    <RouterContext.Provider value={{ currentRoute, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
export default RouterProvider;
