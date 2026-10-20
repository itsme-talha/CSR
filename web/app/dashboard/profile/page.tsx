"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function ProfileSetupPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    regNumber: '',
    department: '',
    semester: '',
    cgpa: '',
    cnicNumber: '',
    guardianName: '',
    guardianOccupation: '',
    guardianIncome: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/beneficiaries/profile');
      const profileData = response.data.data ? response.data.data : response.data;

      if (profileData && (profileData.regNumber || profileData.cnicNumber)) {
        setFormData({
          regNumber: profileData.regNumber || '',
          department: profileData.department || '',
          semester: profileData.semester || '',
          cgpa: profileData.cgpa || '',
          cnicNumber: profileData.cnicNumber || '',
          guardianName: profileData.guardianName || '',
          guardianOccupation: profileData.guardianOccupation || '',
          guardianIncome: profileData.guardianIncome || ''
        });
        setIsEditMode(false); 
      } else {
        setIsEditMode(true); 
      }
    } catch (err) {
      setIsEditMode(true); 
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await api.post('/beneficiaries/profile', formData);
      if (response.data.success || response.status === 200 || response.status === 201) {
        setMessage({ text: 'Profile successfully updated!', type: 'success' });
        setIsEditMode(false); 
      }
    } catch (err: any) {
      // Backend error extraction
      const backendError = err.response?.data?.message || 'Profile could not be saved. Please check your details and try again.';
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
      
      {/* RESIZABLE SIDEBAR COMPONENT */}
      <Sidebar 
        userRole="BENEFICIARY" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* DASHBOARD NAVBAR COMPONENT */}
        <DashboardNavbar 
          userRole="BENEFICIARY" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-action"></div>
              </div>
            ) : !isEditMode ? (
              // === VIEW MODE: PROFILE CARD ===
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header Profile Section */}
                <div className="bg-brand-dark px-8 py-10 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-brand-light text-brand-action rounded-full flex items-center justify-center text-3xl font-extrabold shadow-lg">
                       {formData.guardianName ? formData.guardianName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Student Profile</h2>
                      <p className="text-brand-primary font-medium text-sm">Active Beneficiary</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm backdrop-blur-md"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-8 space-y-8">
                  {message.text && message.type === 'success' && (
                    <div className="p-4 rounded-xl text-sm font-bold shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                      {message.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Academic Info */}
                    <div className="space-y-5">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Academic Information</h3>
                      
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Registration Number</p>
                        <p className="font-extrabold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">{formData.regNumber || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Department</p>
                        <p className="font-extrabold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 capitalize">{formData.department || 'Not provided'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 mb-1">Semester</p>
                          <p className="font-extrabold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">{formData.semester || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 mb-1">CGPA</p>
                          <p className="font-extrabold text-brand-action bg-brand-light/30 p-3 rounded-xl border border-brand-light">{formData.cgpa || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Personal Info */}
                    <div className="space-y-5">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Personal & Financial Details</h3>
                      
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">CNIC Number</p>
                        <p className="font-extrabold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono tracking-wide">{formData.cnicNumber || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Guardian Name</p>
                        <p className="font-extrabold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 capitalize">{formData.guardianName || 'Not provided'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 mb-1">Occupation</p>
                          <p className="font-extrabold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 capitalize line-clamp-1" title={formData.guardianOccupation}>{formData.guardianOccupation || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 mb-1">Income (Rs.)</p>
                          <p className="font-extrabold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{formData.guardianIncome ? Number(formData.guardianIncome).toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // === EDIT MODE: FORM ===
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative animate-fade-in-down">
                
                {/* Cancel Edit Button */}
                {formData.regNumber && (
                  <button 
                    onClick={() => {
                      setIsEditMode(false);
                      setMessage({ text: '', type: '' });
                    }}
                    className="absolute top-8 right-8 text-slate-400 hover:text-rose-500 font-bold text-3xl transition"
                  >
                    &times;
                  </button>
                )}

                <div className="mb-8 pr-12">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Profile Setup</h2>
                  <p className="text-sm text-slate-500 font-medium">Please enter your accurate academic and financial details to process your assistance requests smoothly.</p>
                </div>

                {/* Validation Error Message Box */}
                {message.text && message.type === 'error' && (
                  <div className="p-4 rounded-xl mb-8 text-sm font-bold shadow-sm bg-rose-50 text-rose-700 border border-rose-200 flex items-start gap-3">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Academic Information Section */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                      Academic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Registration Number</label>
                        <input type="text" name="regNumber" required value={formData.regNumber} onChange={handleChange} placeholder="e.g., FA22-BSE-045"
                          className={`w-full px-4 py-3 border rounded-xl outline-none text-sm font-bold shadow-inner transition-all ${message.text.toLowerCase().includes('registration') || message.text.toLowerCase().includes('reg') ? 'border-rose-300 focus:ring-2 focus:ring-rose-500 bg-rose-50' : 'border-slate-300 focus:ring-2 focus:ring-brand-action bg-white'}`} />
                      </div>
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Department</label>
                        <input type="text" name="department" required value={formData.department} onChange={handleChange} placeholder="e.g., Software Engineering"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Current Semester</label>
                        <input type="number" name="semester" required value={formData.semester} onChange={handleChange} placeholder="e.g., 6"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Current CGPA</label>
                        <input type="number" step="0.01" name="cgpa" required value={formData.cgpa} onChange={handleChange} placeholder="e.g., 3.45"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" />
                      </div>
                    </div>
                  </div>

                  {/* Personal & Financial Information Section */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">CNIC Number</label>
                        <input type="text" name="cnicNumber" required value={formData.cnicNumber} onChange={handleChange} placeholder="31202-1234567-8"
                          className={`w-full px-4 py-3 border rounded-xl outline-none text-sm font-bold shadow-inner transition-all ${message.text.toLowerCase().includes('cnic') ? 'border-rose-300 focus:ring-2 focus:ring-rose-500 bg-rose-50' : 'border-slate-300 focus:ring-2 focus:ring-brand-action bg-white'}`} />
                      </div>
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Guardian Name</label>
                        <input type="text" name="guardianName" required value={formData.guardianName} onChange={handleChange} placeholder="Enter guardian's full name"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Guardian Occupation</label>
                        <input type="text" name="guardianOccupation" required value={formData.guardianOccupation} onChange={handleChange} placeholder="e.g., Govt Employee, Shopkeeper"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Monthly Income (Rs.)</label>
                        <input type="number" name="guardianIncome" required value={formData.guardianIncome} onChange={handleChange} placeholder="e.g., 45000"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-action bg-white transition-all outline-none text-sm font-bold shadow-inner" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                    {formData.regNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditMode(false);
                          setMessage({ text: '', type: '' });
                        }}
                        className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-10 bg-brand-action hover:opacity-90 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving Profile...' : 'Save Profile'}
                    </button>
                  </div>
                </form>

              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}