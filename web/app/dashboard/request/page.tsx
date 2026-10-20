"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api'; 
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function AssistanceRequestPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    category: 'TUITION', // Default category
    requestedAmount: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.type === 'error') {
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await api.post('/beneficiaries/requests', {
        ...formData,
        requestedAmount: Number(formData.requestedAmount) // String to Number
      });
      
      if (response.data.success || response.status === 200 || response.status === 201) {
        setMessage({ text: 'Your request has been submitted successfully! Admin will review it soon.', type: 'success' });
        setTimeout(() => router.push('/dashboard'), 2500);
      }
    } catch (err: any) {
      const backendError = err.response?.data?.message || 'Request could not be submitted. Please make sure your profile is complete.';
      setMessage({ 
        text: backendError, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. NAYA RESIZABLE SIDEBAR COMPONENT */}
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
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative animate-fade-in-down">
              
              <div className="mb-8 pr-4">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Request Assistance</h2>
                <p className="text-sm text-slate-500 font-medium">Please select the category and explain why you need financial support.</p>
              </div>

              {/* Message Box (Error or Success) */}
              {message.text && (
                <div className={`p-4 rounded-xl mb-8 text-sm font-bold shadow-sm flex items-start gap-3 ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {message.type === 'error' && (
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  )}
                  {message.type === 'success' && (
                     <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                  
                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      Assistance Category
                    </label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner cursor-pointer"
                    >
                      <option value="TUITION">Tuition Fee</option>
                      <option value="HOSTEL">Hostel Dues</option>
                      <option value="MEDICAL">Medical Emergency</option>
                      <option value="TRANSPORT">Transport / Bus Pass</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Requested Amount (Rs.)
                    </label>
                    <input 
                      type="number" 
                      name="requestedAmount" 
                      required 
                      onChange={handleChange} 
                      placeholder="e.g., 25000"
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Description / Reason
                    </label>
                    <textarea 
                      name="description" 
                      required 
                      rows={5}
                      onChange={handleChange} 
                      placeholder="Explain your situation in detail so admins can verify your request easily..."
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-medium resize-none shadow-inner leading-relaxed" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-brand-action hover:opacity-90 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-base"
                  >
                    {loading ? 'Submitting Request...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}