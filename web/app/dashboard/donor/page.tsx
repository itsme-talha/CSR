"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DonorDashboardPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. RESIZABLE SIDEBAR COMPONENT */}
      <Sidebar 
        userRole="DONOR" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* DASHBOARD NAVBAR COMPONENT */}
        <DashboardNavbar 
          userRole="DONOR" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* WELCOME BANNER (Fully English) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back, Change Maker! 🌟</h2>
                <p className="text-slate-500 text-lg mb-6 max-w-2xl font-medium">
                  Your support can change a student's life. Browse our active campaigns and make a real difference today.
                </p>
                <button 
                  onClick={() => router.push('/dashboard/donor/campaigns')} 
                  className="px-6 py-3 bg-brand-action text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-all hover:scale-105"
                >
                  Explore Campaigns
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Campaigns Card */}
              <div 
                onClick={() => router.push('/dashboard/donor/campaigns')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-action/50 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform shadow-inner border border-emerald-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2 tracking-tight">Active Campaigns</h3>
                  <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Browse running charity drives, read student stories, and donate to those in need.</p>
                </div>
                <div className="text-brand-action font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Campaigns <span className="text-lg leading-none">&rarr;</span>
                </div>
              </div>

              {/* History Card */}
              <div 
                onClick={() => router.push('/dashboard/donor/history')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform shadow-inner border border-blue-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2 tracking-tight">My Donation History</h3>
                  <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Track all your past donations, view receipts, and see the impact of your contributions.</p>
                </div>
                <div className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View History <span className="text-lg leading-none">&rarr;</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}