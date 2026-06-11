import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AdminRoute from '@/components/layout/AdminRoute';

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const SearchPage = React.lazy(() => import('@/pages/SearchPage'));
const TrendsPage = React.lazy(() => import('@/pages/TrendsPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const AdminDashboardPage = React.lazy(() => import('@/pages/AdminDashboardPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/trends" element={<TrendsPage />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
