'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from './layout';

export default function AdminPage() {
  const router = useRouter();

  // Redirect to the default admin page (e.g., dashboard)
  React.useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <AdminLayout>
      <div>Redirecting...</div>
    </AdminLayout>
  );
}