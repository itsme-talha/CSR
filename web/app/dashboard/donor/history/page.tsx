"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api'; 
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DonorHistoryPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const response = await api.get('/donations/my-history');
      if (response.data.success) {
        setDonations(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch donation history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. NAYA RESIZABLE SIDEBAR COMPONENT */}
      <Sidebar 
        userRole="DONOR" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* NAYA DASHBOARD NAVBAR COMPONENT */}
        <DashboardNavbar 
          userRole="DONOR" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">My Donation History</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">View all your past contributions and their current verification status.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-action"></div>
              </div>
            ) : donations.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg mb-4">You haven't made any donations yet.</p>
                <button 
                  onClick={() => router.push('/dashboard/donor/campaigns')}
                  className="px-8 py-3.5 bg-brand-action hover:bg-brand-action/90 text-white font-extrabold rounded-xl shadow-md transition-all hover:scale-105 text-sm"
                >
                  Support a Campaign
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
                        <th className="px-6 py-4 rounded-tl-2xl">Date</th>
                        <th className="px-6 py-4">Campaign Details</th>
                        <th className="px-6 py-4">Amount (Rs)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center rounded-tr-2xl">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {donations.map((don: any) => (
                        <tr key={don.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-5 text-sm text-slate-600 font-bold">
                            {formatDate(don.donatedAt)}
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{don.campaign?.title}</p>
                            <p className="text-xs font-mono text-slate-500 mt-1">TID: {don.transactionReference || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-brand-action text-sm bg-brand-light/50 px-2 py-1 rounded w-fit">Rs. {don.amount?.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                              don.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                              don.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                              'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {don.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <a 
                              href={`http://localhost:5000${don.receiptUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-brand-action hover:text-blue-700 font-bold text-xs bg-brand-light px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}