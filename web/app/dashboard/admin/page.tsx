"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar'; // Naya Sidebar import kiya
import DashboardNavbar from '@/components/DashboardNavbar'; // Navbar import kiya

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [pendingDonations, setPendingDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/admin/dashboard-stats');
        if (statsRes.data.success) setStats(statsRes.data.data);

        const requestsRes = await api.get('/admin/requests');
        if (requestsRes.data.success) {
          const pending = requestsRes.data.data.filter((req: any) => req.status === 'PENDING');
          setPendingRequests(pending);
        }

        const campaignsRes = await api.get('/admin/campaigns');
        if (campaignsRes.data.success) {
          const active = campaignsRes.data.data.filter((camp: any) => camp.status === 'ACTIVE');
          setActiveCampaigns(active);
        }

        const donationsRes = await api.get('/admin/donations');
        if (donationsRes.data.success) {
           const pendingDon = donationsRes.data.data.filter((don: any) => don.status === 'PENDING');
           setPendingDonations(pendingDon);
        }

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-action"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Naya Reusable Sidebar */}
      <Sidebar 
        userRole="ADMIN" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        {/* Naya Reusable Dashboard Navbar */}
        <DashboardNavbar 
          userRole="ADMIN" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Cards wahi purane hain, main unki styling thori behtar kar raha hoon */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Total Donations</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Rs. {stats?.totalFundsRaised?.toLocaleString() || '0'}</h3>
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2.5 py-1 rounded-md">Total Collection</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Active Campaigns</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{stats?.activeCampaigns || 0}</h3>
                <p className="text-xs font-bold text-brand-action bg-brand-light inline-block px-2.5 py-1 rounded-md">Running live</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Pending Applications</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{stats?.pendingRequests || 0}</h3>
                <p className="text-xs font-bold text-rose-600 bg-rose-50 inline-block px-2.5 py-1 rounded-md">Action Required</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Registered Beneficiaries</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{stats?.totalBeneficiaries || 0}</h3>
                <p className="text-xs font-bold text-blue-600 bg-blue-50 inline-block px-2.5 py-1 rounded-md">Total Students</p>
              </div>
            </div>

            {/* SPACIOUS 2x2 GRID FOR WIDGETS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              
              {/* 1. CHART WIDGET */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[350px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Donation Graph</h3>
                    <p className="text-xs text-slate-500 mt-1">Monthly collection trend</p>
                  </div>
                  <h3 className="font-extrabold text-xl text-brand-action">Rs {stats?.totalFundsRaised?.toLocaleString() || '0'}</h3>
                </div>
                {/* Fake Line graph SVG - Same as before */}
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 flex mt-2 relative p-4">
                     <div className="flex flex-col justify-between h-full pr-4 pb-6 text-right w-12 sm:w-16 border-r border-slate-200 text-xs font-medium text-slate-400">
                       <span>High</span><span>Med</span><span>Low</span><span>0</span>
                     </div>
                     <div className="flex-1 relative pb-6 ml-4">
                       <svg className="absolute inset-0 w-full h-full opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <path d="M0,90 C10,60 20,65 30,55 C40,75 50,45 60,70 C70,20 80,40 100,20" fill="none" stroke="currentColor" className="text-brand-action" strokeWidth="2" />
                       </svg>
                       <div className="absolute bottom-0 left-0 w-full flex justify-between pt-3 border-t border-slate-200 text-[10px] sm:text-xs font-bold text-slate-400">
                         <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                       </div>
                     </div>
                </div>
              </div>

              {/* 2. PENDING BENEFICIARY APPLICATIONS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[350px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-900">Pending Applications</h3>
                  <Link href="/dashboard/admin/requests" className="text-sm font-bold text-brand-action hover:underline">
                    View All
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-3">
                    {pendingRequests.length > 0 ? pendingRequests.slice(0, 4).map((req, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-action/30 transition-colors gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{req.beneficiary?.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{req.category} • {new Date(req.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md uppercase tracking-wide">
                            {req.status}
                          </span>
                          <button className="text-xs font-bold text-brand-action hover:underline">Review</button>
                        </div>
                      </div>
                    )) : <p className="text-slate-500 text-sm text-center mt-10">No pending applications.</p>}
                  </div>
                </div>
              </div>

              {/* 3. VERIFY DONATIONS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[350px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Verify Donations</h3>
                    <p className="text-xs text-slate-500 mt-1">Receipts pending approval</p>
                  </div>
                  <Link href="/dashboard/admin/donations" className="text-sm font-bold text-brand-action hover:underline">
                    View All
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-3">
                    {pendingDonations.length > 0 ? pendingDonations.slice(0, 4).map((don, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-action/30 transition-colors">
                        <div className="truncate pr-2">
                          <p className="font-bold text-slate-900 truncate">{don.donor?.name || 'Anonymous'}</p>
                          <p className="text-xs text-brand-action font-bold mt-1 truncate">{don.campaign?.title || 'General Fund'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-slate-900">Rs. {don.amount?.toLocaleString()}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(don.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )) : <p className="text-slate-500 text-sm text-center mt-10">No pending donations to verify.</p>}
                  </div>
                </div>
              </div>

              {/* 4. ACTIVE CAMPAIGNS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[350px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-900">Active Campaigns</h3>
                  <Link href="/dashboard/admin/campaigns" className="text-sm font-bold text-brand-action hover:underline">
                    Manage All
                  </Link>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {activeCampaigns.length > 0 ? activeCampaigns.slice(0, 3).map((camp, idx) => {
                    const progress = camp.targetAmount > 0 ? Math.min((camp.raisedAmount / camp.targetAmount) * 100, 100) : 0;
                    return (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <p className="font-bold text-slate-900 leading-tight flex-1">{camp.title}</p>
                          <p className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-1 rounded shrink-0">
                            Ends: {new Date(camp.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-extrabold text-brand-action mb-3">
                          Rs {camp.raisedAmount?.toLocaleString() || '0'} <span className="text-xs text-slate-500 font-medium">/ Rs {camp.targetAmount?.toLocaleString() || '0'}</span>
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-brand-action h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    );
                  }) : <p className="text-slate-500 text-sm text-center mt-10">No active campaigns.</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}