"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DonorCampaignsPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data States
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Donation Modal States
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('EASYPAISA');
  const [transactionId, setTransactionId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      if (response.data.success) {
        setCampaigns(response.data.data);
        setFilteredCampaigns(response.data.data);
      }
    } catch (err: any) {
      setError('Failed to load campaigns. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // === SEARCH FUNCTIONALITY ===
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredCampaigns(campaigns);
      return;
    }

    const filtered = campaigns.filter(camp => {
      return (
        camp.title?.toLowerCase().includes(query) ||
        camp.description?.toLowerCase().includes(query) ||
        camp.status?.toLowerCase().includes(query) ||
        camp.targetAmount?.toString().includes(query) ||
        camp.collectedAmount?.toString().includes(query)
      );
    });
    
    setFilteredCampaigns(filtered);
  }, [searchQuery, campaigns]);

  const calculateProgress = (raised: number, target: number) => {
    if (!target || target === 0) return 0;
    const percentage = (raised / target) * 100;
    return percentage > 100 ? 100 : Math.round(percentage);
  };

  // Donation Submit
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      alert('Please upload a screenshot or receipt of your payment to proceed.');
      return;
    }

    setIsDonating(true);
    const formData = new FormData();
    formData.append('campaignId', selectedCampaign.id);
    formData.append('amount', donationAmount);
    formData.append('paymentMethod', paymentMethod);
    formData.append('transactionId', transactionId);
    formData.append('receipt', receiptFile);

    try {
      const res = await api.post('/donations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        alert('Thank you! Your donation details have been submitted successfully. The admin will verify it shortly.');
        setSelectedCampaign(null);
        setDonationAmount('');
        setTransactionId('');
        setReceiptFile(null);
        fetchCampaigns(); 
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit donation. Please try again.');
    } finally {
      setIsDonating(false);
    }
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
        
        {/* DASHBOARD NAVBAR COMPONENT */}
        <DashboardNavbar 
          userRole="DONOR" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Active Charity Campaigns</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Your small contribution can help a student achieve their dreams.</p>
              </div>

              {/* Functional Search Bar */}
              <div className="relative w-full md:w-auto">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Title, Status, or Amount..." 
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
            ) : filteredCampaigns.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg">No active campaigns right now</p>
                <p className="text-slate-400 text-sm mt-1">Please check back later to see new campaigns.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign: any) => (
                  <div key={campaign.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-extrabold text-slate-900 line-clamp-2 leading-tight pr-2">{campaign.title}</h3>
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 shadow-sm border border-emerald-200">Active</span>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                        {campaign.description}
                      </p>

                      <div className="mb-2 mt-auto">
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-brand-action">Rs. {campaign.collectedAmount?.toLocaleString() || 0} raised</span>
                          <span className="text-slate-500">Goal: Rs. {campaign.targetAmount?.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                          <div 
                            className="bg-brand-action h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(campaign.collectedAmount || 0, campaign.targetAmount)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 pt-0">
                      {campaign.status === 'COMPLETED' ? (
                        <button 
                          disabled 
                          className="w-full py-3.5 bg-slate-100 text-slate-500 font-extrabold rounded-xl cursor-not-allowed transition-all text-sm"
                        >
                          Target Reached 🎉
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedCampaign(campaign)}
                          className="w-full py-3.5 bg-brand-action hover:bg-brand-action/90 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
                        >
                          Donate Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- DONATION MODAL --- */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 max-h-[95vh] overflow-y-auto animate-fade-in-down relative">
            <button 
                onClick={() => setSelectedCampaign(null)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 font-bold text-3xl transition"
            >
                &times;
            </button>
            
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2 border-b border-slate-100 pb-4 pr-8">Make a Donation</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Please send your funds to the account below and submit the details to verify your donation.</p>
            
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-8 shadow-sm">
              <h4 className="font-extrabold text-blue-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Official Transfer Details
              </h4>
              <div className="space-y-1.5 bg-white p-3 rounded-xl border border-blue-100">
                 <p className="text-sm text-slate-800 font-bold">Bank: <span className="font-mono text-brand-action">Meezan Bank (Account: 0123456789)</span></p>
                 <p className="text-sm text-slate-800 font-bold">Mobile Wallet: <span className="font-mono text-brand-action">0300-1234567 (Easypaisa / JazzCash)</span></p>
              </div>
            </div>
            
            <form onSubmit={handleDonationSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Donation Amount (Rs)</label>
                <input 
                  type="number" required 
                  placeholder="e.g. 5000"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-bold transition-all shadow-inner" 
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-bold transition-all shadow-inner cursor-pointer"
                >
                  <option value="EASYPAISA">EasyPaisa</option>
                  <option value="JAZZCASH">JazzCash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Transaction ID / Reference Number</label>
                <input 
                  type="text" required 
                  placeholder="e.g. TID123456789"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-bold transition-all shadow-inner" 
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Upload Receipt</label>
                <input 
                  type="file" required 
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-sm font-medium text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-300 rounded-xl p-1 bg-white cursor-pointer transition-all" 
                />
                <p className="text-[10px] font-bold text-slate-400 mt-1.5 pl-1 uppercase tracking-wide">Accepted formats: JPG, PNG, PDF</p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-8">
                <button
                  type="submit"
                  disabled={isDonating}
                  className="w-full py-3.5 bg-brand-action text-white hover:opacity-90 font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-base"
                >
                  {isDonating ? 'Submitting Receipt...' : 'Confirm Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}