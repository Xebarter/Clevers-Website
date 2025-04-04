"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import AdminNav from './AdminNav';
import { useAdminAuth } from './auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, isLoading } = useAdminAuth();

  // Don't apply authentication check to the login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kinder-blue/10 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!session.isAuthenticated) {
    redirect('/admin');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 hidden md:block">
        <AdminNav />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <header className="bg-white border-b border-gray-200 shadow-sm md:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-kinder-red" />
                <div className="h-6 w-6 rounded-full bg-kinder-blue -ml-1.5" />
                <div className="h-6 w-6 rounded-full bg-kinder-green -ml-1.5" />
              </div>
              <span className="ml-2 font-bold text-lg font-heading">Admin Dashboard</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
