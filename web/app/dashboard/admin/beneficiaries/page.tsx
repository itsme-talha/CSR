"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function AdminBeneficiariesPage() {
  const router = useRouter();
  
  // Data States
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<any[]>([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await api.get('/admin/beneficiaries');
        if (response.data.success) {
          setBeneficiaries(response.data.data);
          setFilteredBeneficiaries(response.data.data); // Initial set
        }
      } catch (err: any) {
        console.error("Failed to load beneficiaries", err);
        setError('Data fetch karne mein masla aaya. Backend check karein.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBeneficiaries();
  }, []);

  // === SEARCH FUNCTIONALITY ===
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredBeneficiaries(beneficiaries);
      return;
    }

    const filtered = beneficiaries.filter(student => {
      return (
        student.name?.toLowerCase().includes(query) ||
        student.department?.toLowerCase().includes(query) ||
        student.cnic?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
      );
    });
    
    setFilteredBeneficiaries(filtered);
  }, [searchQuery, beneficiaries]);


  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Draggable Sidebar Component */}
      <Sidebar 
        userRole="ADMIN" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* Modern Dashboard Navbar */}
        <DashboardNavbar 
          userRole="ADMIN" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Registered Students Profiles</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Beneficiaries ki academic aur personal details yahan dekhein.</p>
              </div>
              
              {/* Functional Search Bar */}
              <div className="relative w-full md:w-auto">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name, Dept, CNIC..." 
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
            ) : error ? (
              <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 font-bold">
                {error}
              </div>
            ) : filteredBeneficiaries.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg">No beneficiaries found</p>
                {searchQuery && <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms.</p>}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
                        <th className="px-6 py-4 rounded-tl-2xl">Student Info</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Academics (Sem / CGPA)</th>
                        <th className="px-6 py-4 rounded-tr-2xl">CNIC & Guardian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBeneficiaries.map((student: any) => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-brand-light text-brand-action flex items-center justify-center font-bold text-lg border-2 border-transparent group-hover:border-brand-action/20 transition-all shadow-sm">
                                {student.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 capitalize">{student.name}</p>
                                <p className="text-xs font-medium text-slate-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-700 capitalize text-sm">{student.department || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded inline-block w-fit">
                                Semester: {student.semester || 'N/A'}
                              </span>
                              <span className="text-xs font-bold text-brand-action bg-brand-light px-2.5 py-1 rounded inline-block w-fit">
                                CGPA: {student.cgpa || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-slate-800 text-sm tracking-wide">{student.cnic || 'N/A'}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Guardian: <span className="font-bold text-slate-700">{student.guardianName || 'N/A'}</span></p>
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