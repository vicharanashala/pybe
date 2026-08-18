import React from 'react';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell" style={{ padding: '2rem' }}>
      <div className="panel" style={{ padding: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user?.username} (ADMIN)</p>
        <p>This is a placeholder for the Phase 10 Admin Dashboard.</p>
        <button onClick={logout} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Logout</button>
      </div>
    </div>
  );
}
