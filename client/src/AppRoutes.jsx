import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LevelView } from './pages/LevelView';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Student + Admin Protected Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />
              }
            >
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/level/:id" element={<LevelView />} />
            </Route>

            {/* Admin Only Route */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['ADMIN']} />
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Login />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}