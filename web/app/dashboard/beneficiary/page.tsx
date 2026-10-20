"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function BeneficiaryDashboardPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. RESIZABLE SIDEBAR COMPONENT */}
      <Sidebar 
        userRole="BENEFICIARY" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* DASHBOARD NAVBAR COMPONENT */}
        <DashboardNavbar 
          userRole="BENEFICIARY" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* WELCOME BANNER (Fully English) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome to Charity Hub! 👋</h2>
                <p className="text-slate-500 text-lg mb-8 max-w-2xl font-medium leading-relaxed">
                  Please complete your profile before applying for financial assistance. You can manage your applications and documents right here.
                </p>
                <button 
                  onClick={() => router.push('/dashboard/request')} 
                  className="px-8 py-3.5 bg-brand-action text-white font-extrabold rounded-xl shadow-lg hover:bg-brand-action/90 transition-all hover:scale-105"
                >
                  Start New Application
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Profile Card */}
              <div 
                onClick={() => router.push('/dashboard/profile')}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-brand-action/50 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform shadow-inner border border-blue-100">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1 tracking-tight">Setup Profile</h3>
                <p className="text-xs font-medium text-slate-500">Update academic & personal details</p>
              </div>

              {/* Request Card */}
              <div 
                onClick={() => router.push('/dashboard/request')}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-brand-action/50 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform shadow-inner border border-emerald-100">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1 tracking-tight">Apply Assistance</h3>
                <p className="text-xs font-medium text-slate-500">Submit a new financial request</p>
              </div>

              {/* Upload Card */}
              <div 
                onClick={() => router.push('/dashboard/upload')}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-brand-action/50 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform shadow-inner border border-purple-100">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1 tracking-tight">Documents</h3>
                <p className="text-xs font-medium text-slate-500">Upload CNIC, Fee challan, etc.</p>
              </div>

              {/* Status Card */}
              <div 
                onClick={() => router.push('/dashboard/beneficiary/status')}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-brand-action/50 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform shadow-inner border border-amber-100">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1 tracking-tight">Check Status</h3>
                <p className="text-xs font-medium text-slate-500">Track your application progress</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}