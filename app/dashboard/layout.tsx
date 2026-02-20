'use client';

import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import AppLayout from '@/components/app-layout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
}
