"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import NotificationBell from '@/components/NotificationBell';

export default function AdminDonationsPage() {
  const router = useRouter();
  
  // Data States
  const [donations, setDonations] = useState<any[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<any[]>([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modal States
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/admin/donations');
      if (response.data.success) {
        setDonations(response.data.data);
        setFilteredDonations(response.data.data); // Default for search
      }
    } catch (err: any) {
      setError('Failed to fetch donations.');
    } finally {
      setLoading(false);
    }
  };

  // === SEARCH FUNCTIONALITY ===
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredDonations(donations);
      return;
    }

    const filtered = donations.filter(don => {
      return (
        don.campaign?.title?.toLowerCase().includes(query) ||
        don.donor?.name?.toLowerCase().includes(query) ||
        don.transactionReference?.toLowerCase().includes(query) ||
        don.status?.toLowerCase().includes(query) ||
        don.amount?.toString().includes(query)
      );
    });
    
    setFilteredDonations(filtered);
  }, [searchQuery, donations]);

  const handleVerification = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    setVerifyLoading(true);
    try {
      await api.put(`/admin/donations/${id}/verify`, { status });
      alert(`Donation successfully ${status.toLowerCase()}!`);
      setSelectedDonation(null);
      fetchDonations();
    } catch (err) {
      alert('Verification failed. Try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Naya Draggable Sidebar Component */}
      <Sidebar 
        userRole="ADMIN" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* Naya Modern Dashboard Navbar */}
        <DashboardNavbar 
          userRole="ADMIN" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Verify Donor Payments</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Check receipts and verify donor payments to add funds to campaigns.</p>
              </div>

              {/* Functional Search Bar */}
              <div className="relative w-full md:w-auto">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by TID, Donor, Campaign..." 
                  className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-action outline-none shadow-sm transition-all placeholder:text-slate-400 text-slate-800"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 font-bold shadow-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-action"></div>
              </div>
            ) : filteredDonations.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg">No donations found</p>
                {searchQuery && <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms.</p>}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
                        <th className="px-6 py-4 rounded-tl-2xl">Campaign & Donor</th>
                        <th className="px-6 py-4">Amount (Rs)</th>
                        <th className="px-6 py-4">TID / Reference</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDonations.map((don: any) => (
                        <tr key={don.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{don.campaign?.title || 'General Fund'}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">By: <span className="font-bold text-slate-700">{don.donor?.name || 'Anonymous'}</span></p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-brand-action text-sm bg-brand-light/50 px-2 py-1 rounded w-fit">Rs. {don.amount?.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">{don.transactionReference || 'N/A'}</p>
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
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => setSelectedDonation(don)}
                              className="px-5 py-2.5 bg-brand-dark text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
                            >
                              Verify Proof
                            </button>
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

      {/* --- RECEIPT MODAL --- */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto animate-fade-in-down">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900">Payment Verification</h3>
              <button 
                onClick={() => setSelectedDonation(null)} 
                className="text-slate-400 hover:text-rose-500 font-bold text-2xl transition"
              >
                &times;
              </button>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Transaction Details (TID):</p>
              <p className="font-mono font-extrabold text-lg text-slate-900 mb-5 bg-white p-2 rounded-lg border border-slate-200 w-fit">{selectedDonation.transactionReference}</p>
              
              <p className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Claimed Amount:</p>
              <p className="font-extrabold text-3xl text-brand-action">Rs. {selectedDonation.amount?.toLocaleString()}</p>
            </div>

            <div className="mb-8 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-2 relative overflow-hidden group">
                <a href={`http://localhost:5000${selectedDonation.receiptUrl}`} target="_blank" rel="noopener noreferrer" title="Click to view full image" className="relative w-full flex justify-center">
                    <img 
                        src={`http://localhost:5000${selectedDonation.receiptUrl}`} 
                        alt="Payment Receipt" 
                        className="max-h-72 object-contain rounded-xl shadow-sm group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors rounded-xl flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transition-opacity flex items-center gap-1">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                         Enlarge Receipt
                      </span>
                    </div>
                </a>
            </div>

            <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
              {selectedDonation.status === 'PENDING' ? (
                <>
                  <button
                    disabled={verifyLoading}
                    onClick={() => handleVerification(selectedDonation.id, 'REJECTED')}
                    className="flex-1 py-3.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold text-sm rounded-xl transition-colors disabled:opacity-50"
                  >
                    Reject Fake
                  </button>
                  <button
                    disabled={verifyLoading}
                    onClick={() => handleVerification(selectedDonation.id, 'VERIFIED')}
                    className="flex-[2] py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md font-extrabold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {verifyLoading ? 'Verifying...' : 'Approve & Add Funds'}
                  </button>
                </>
              ) : (
                 <div className="w-full text-center py-3 bg-slate-100 rounded-xl text-slate-600 font-bold text-sm">
                    This donation is already {selectedDonation.status.toLowerCase()}.
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}