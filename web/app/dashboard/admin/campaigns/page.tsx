"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import NotificationBell from '@/components/NotificationBell';

export default function AdminCampaignsPage() {
  const router = useRouter();
  
  // Data States
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal aur File ke liye states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/admin/campaigns');
      if (response.data.success) {
        setCampaigns(response.data.data);
        setFilteredCampaigns(response.data.data); // Search ke liye default data
      }
    } catch (err) {
      console.error('Failed to fetch campaigns');
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
        camp.status?.toLowerCase().includes(query) ||
        camp.targetAmount?.toString().includes(query)
      );
    });
    
    setFilteredCampaigns(filtered);
  }, [searchQuery, campaigns]);

  const handleStatusChange = async (campaign: any) => {
    if (campaign.status === 'ACTIVE') {
      // Agar active hai toh popup kholen taake slip upload kar sake
      setSelectedCampaign(campaign);
      setIsModalOpen(true);
    } else {
      // Agar completed hai toh direct Re-open kar dein (bina file ke)
      if (!confirm("Kiya aap is campaign ko dobara Re-open karna chahte hain?")) return;
      try {
        await api.put(`/admin/campaigns/${campaign.id}/status`, { status: 'ACTIVE' });
        alert('Campaign successfully Re-opened!');
        fetchCampaigns();
      } catch (err) {
        alert('Error updating campaign status.');
      }
    }
  };

  const handleDisbursementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      alert("Barae meherbani pehle bank slip ya screenshot attach karein!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('status', 'COMPLETED');
      formData.append('proof', proofFile);

      // Multer ke liye multipart/form-data zaroori hai
      await api.put(`/admin/campaigns/${selectedCampaign.id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Zabardast! Campaign Closed aur Proof upload ho gaya hai.');
      setIsModalOpen(false);
      setProofFile(null);
      fetchCampaigns();
    } catch (err) {
      alert('Error uploading proof. Please try again.');
    }
  };

  const calculateProgress = (raised: number, target: number) => {
    if (!target || target === 0) return 0;
    const percentage = (raised / target) * 100;
    return percentage > 100 ? 100 : Math.round(percentage);
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
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Campaigns Management</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Manage charity drives, track progress, and disburse funds.</p>
              </div>

              {/* Functional Search Bar */}
              <div className="relative w-full md:w-auto">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Title, Status or Amount..." 
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-action"></div>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg">No campaigns found</p>
                {searchQuery && <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCampaigns.map((camp: any) => (
                  <div key={camp.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-extrabold text-lg text-slate-900 line-clamp-1">{camp.title}</h3>
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm ${camp.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {camp.status}
                      </span>
                    </div>
                    
                    <div className="mb-4 mt-8">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-extrabold text-brand-action">Rs. {camp.collectedAmount?.toLocaleString() || 0} Collected</span>
                        <span className="text-slate-500 font-medium">Target: Rs. {camp.targetAmount?.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 mt-2 shadow-inner overflow-hidden">
                        <div className="bg-brand-action h-3 rounded-full transition-all duration-500" style={{ width: `${calculateProgress(camp.collectedAmount || 0, camp.targetAmount)}%` }}></div>
                      </div>
                    </div>

                    {/* Status ke hisab se Button */}
                    {camp.status === 'ACTIVE' ? (
                      <button 
                        onClick={() => handleStatusChange(camp)}
                        className="w-full mt-4 py-3 bg-brand-action hover:bg-brand-action/90 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
                      >
                        Disburse Funds & Close
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(camp)}
                        className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm hover:shadow-md"
                      >
                        Re-open Campaign
                      </button>
                    )}

                    {/* Disbursement Proof */}
                    {camp.disbursementProof && (
                      <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-700">Disbursement Record</p>
                        <a 
                          href={`http://localhost:5000${camp.disbursementProof}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-brand-action hover:text-blue-700 font-bold text-xs bg-brand-light px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View Receipt
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DISBURSEMENT PROOF MODAL (POPUP) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-down">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-extrabold text-slate-900">Transfer Funds</h3>
              <button onClick={() => { setIsModalOpen(false); setProofFile(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Campaign "{selectedCampaign?.title}" ke funds student ko transfer karein.
            </p>
            
            {/* STUDENT BANK ACCOUNT DETAILS SECTION */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-6 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Beneficiary Account Details
              </h4>
              {selectedCampaign?.request?.accountDetails ? (
                 <p className="text-sm text-slate-800 font-bold font-mono whitespace-pre-wrap leading-relaxed">
                   {selectedCampaign.request.accountDetails}
                 </p>
              ) : (
                 <div className="flex items-start gap-3 bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <span className="text-rose-500 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </span>
                    <p className="text-xs text-rose-700 font-bold leading-relaxed">
                      Student ne abhi tak apni bank/Easypaisa details submit nahi ki hain. Aap funds transfer nahi kar sakte.
                    </p>
                 </div>
              )}
            </div>

            <form onSubmit={handleDisbursementSubmit}>
              <div className="mb-8">
                <label className="block text-sm font-extrabold text-slate-700 mb-2">Upload Transfer Proof</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-action transition-colors bg-white">
                  <div className="space-y-2 text-center">
                    <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-bold text-brand-action hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-action">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*,.pdf"
                          onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                          disabled={!selectedCampaign?.request?.accountDetails}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">PNG, JPG, PDF up to 5MB</p>
                    {proofFile && <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 py-1 px-2 rounded-lg break-all">{proofFile.name}</p>}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setProofFile(null); }}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!selectedCampaign?.request?.accountDetails}
                  className={`flex-1 py-3.5 font-bold text-sm rounded-xl transition-all shadow-sm ${
                    !selectedCampaign?.request?.accountDetails ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-brand-action hover:bg-brand-action/90 text-white hover:shadow-md'
                  }`}
                >
                  Upload & Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}