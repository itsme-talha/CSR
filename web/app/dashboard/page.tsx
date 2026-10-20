"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
    } else if (userRole === 'ADMIN') {
      router.push('/dashboard/admin');
    } else if (userRole === 'DONOR') {
      router.push('/dashboard/donor');
    } else if (userRole === 'BENEFICIARY') {
      router.push('/dashboard/beneficiary');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-action"></div>
    </div>
  );
}