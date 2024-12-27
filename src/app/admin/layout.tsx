// app/admin/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '../context/AuthContext';  // adjust if needed
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './admin.css';

/**
 * This component contains the logic you had for:
 *  - Checking if we're on /admin/login
 *  - Checking if the user is admin
 *  - Redirecting if needed
 *  - Rendering the correct UI
 */
function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoginPage = pathname === '/admin/login';
    const isAdmin = isAuthenticated && role === 'admin';

    // 1) If NOT admin and NOT on the login page => redirect to /admin/login
    if (!isAdmin && !isLoginPage) {
      router.push('/admin/login');
    }

    // 2) If admin but on the login page => redirect to /admin/dashboard
    if (isAdmin && isLoginPage) {
      router.push('/admin/dashboard');
    }
  }, [pathname, isAuthenticated, role, router]);

  const isLoginPage = pathname === '/admin/login';
  const isAdmin = isAuthenticated && role === 'admin';

  // Show nothing (or a spinner) while we do the redirect logic
  if (!isAdmin && !isLoginPage) {
    return null;
  }

  // If on /admin/login => show the login form (children)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Otherwise, an admin user on admin routes => show the admin layout
  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'linear-gradient(90deg, #F3F6F8 0%, #E6ECF1 100%)' }}
    >
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
}

/**
 * Wrap the ProtectedAdminLayout in the AuthProvider so
 * it can access isAuthenticated, role, etc.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </AuthProvider>
  );
}
