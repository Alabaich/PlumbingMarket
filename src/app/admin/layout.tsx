'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '../context/AuthContext'; // adjust if needed
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './admin.css';

/**
 * Admin Layout:
 * - Redirects to login if user is not authenticated and on a protected route.
 * - Allows /admin/login to render even if unauthenticated.
 * - Redirects unauthenticated users to /admin/login for all other routes.
 */
function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth(); // Ensure role is provided by AuthContext
  const router = useRouter();
  const pathname = usePathname();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Ensure authentication state is initialized
    if (typeof isAuthenticated === 'boolean' && typeof role === 'string') {
      setAuthInitialized(true);

      // Redirect to login if not authenticated and not on the login page
      if (!isAuthenticated || role !== 'admin') {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    }
  }, [isAuthenticated, role, pathname, router]);

  // Render login page directly if not authenticated and on /admin/login
  if (pathname === '/admin/login' && (!isAuthenticated || role !== 'admin')) {
    return <>{children}</>; // Render only the login page
  }

  // Render layout only for authenticated admin users
  if (authInitialized && isAuthenticated && role === 'admin') {
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

  // Show loading state while checking authentication
  return null;
}

/**
 * Wrap the ProtectedAdminLayout in the AuthProvider
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </AuthProvider>
  );
}
