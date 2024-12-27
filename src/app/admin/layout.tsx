'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from './login/page';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('authenticated') === 'true';
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      router.push('/admin/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(90deg, #F3F6F8 0%, #E6ECF1 100%)' }}>
      {/* Header */}
      <Header />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}