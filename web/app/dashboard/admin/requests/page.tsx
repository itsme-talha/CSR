"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api'; 
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI Layout States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filtering & Search States
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Details Modal States
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [adminReason, setAdminReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Chat Modal States
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatRequestId, setChatRequestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Campaign Modal States
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignData, setCampaignData] = useState({
    requestId: '',
    title: '',
    description: '',
    targetAmount: '',
    deadline: ''
  });
  const [campaignLoading, setCampaignLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/requests');
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch requests. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (req: any) => {
    setSelectedRequest(req);
    setDocsLoading(true);
    setDocuments([]);
    setAdminReason(''); 
    setReasonError(''); 
    
    try {
      const response = await api.get(`/admin/requests/${req.id}/documents`);
      if (response.data.success) {
        const allDocs = response.data.data;
        const uniqueDocs = Array.from(new Map(allDocs.map((item: any) => [item.docType, item])).values());
        setDocuments(uniqueDocs as any[]);
      }
    } catch (err) {
      console.error("Failed to load documents");
    } finally {
      setDocsLoading(false);
    }
  };

  const handleVerification = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'MORE_INFORMATION_REQUIRED') => {
    if (status !== 'PENDING' && !adminReason.trim()) {
      setReasonError('Please provide a reason or instruction before submitting.');
      return;
    }
    setReasonError('');

    try {
      await api.put(`/admin/requests/${id}/verify`, { status, adminReason });
      alert(`Request successfully marked as ${status.replace(/_/g, ' ')}!`);
      setSelectedRequest(null);
      setAdminReason(''); 
      fetchRequests(); 
    } catch (err) {
      alert('Verification failed. Try again.');
    }
  };

  const handleOpenCampaignForm = () => {
    const shortId = selectedRequest.beneficiaryId ? selectedRequest.beneficiaryId.substring(0, 5) : 'Student';
    setCampaignData({
      requestId: selectedRequest.id,
      title: `Support for ${selectedRequest.category} ${shortId}`,
      description: selectedRequest.description || '',
      targetAmount: selectedRequest.requestedAmount?.toString() || '0',
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
    setShowCampaignModal(true);
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignLoading(true);
    try {
      const res = await api.post('/admin/campaigns', {
        requestId: campaignData.requestId,
        title: campaignData.title,
        description: campaignData.description,
        targetAmount: Number(campaignData.targetAmount),
        deadline: new Date(campaignData.deadline).toISOString()
      });
      
      if (res.data.success) {
        alert('Campaign successfully launched!');
        setShowCampaignModal(false);
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Campaign launch failed.');
    } finally {
      setCampaignLoading(false);
    }
  };

  const openChat = async (requestId: string) => {
    setChatRequestId(requestId);
    setChatModalOpen(true);
    setLoadingMessages(true);
    setMessages([]);

    try {
      const res = await api.get(`/messages/${requestId}`);
      if (res.data.success) setMessages(res.data.data);
    } catch (err) {
      console.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() && !newAttachment) {
      alert("Please write a message or attach a file.");
      return;
    }

    setSendingMessage(true);
    try {
      const formData = new FormData();
      formData.append('requestId', chatRequestId!);
      formData.append('message', newMessageText);
      if (newAttachment) formData.append('document', newAttachment);

      const res = await api.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessages([...messages, res.data.data]);
        setNewMessageText('');
        setNewAttachment(null);
        const fileInput = document.getElementById('admin-file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  // === DUAL FILTERING LOGIC (Status + Search) ===
  const displayedRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      req.beneficiaryId?.toLowerCase().includes(query) ||
      req.category?.toLowerCase().includes(query) ||
      req.requestedAmount?.toString().includes(query);
      
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. RESIZABLE SIDEBAR */}
      <Sidebar 
        userRole="ADMIN" 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 z-10 relative">
        
        <DashboardNavbar 
          userRole="ADMIN" 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header & Search */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-2">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Review Student Requests</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Manage and verify student applications for financial assistance.</p>
              </div>

              <div className="relative w-full xl:w-auto">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, Category or Amount..." 
                  className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-action outline-none shadow-sm transition-all placeholder:text-slate-400 text-slate-800"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>

            {/* STATUS TABS */}
            <div className="flex gap-2 overflow-x-auto w-full pb-2 custom-scrollbar">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'MORE_INFORMATION_REQUIRED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    filterStatus === status 
                      ? 'bg-brand-action text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status === 'MORE_INFORMATION_REQUIRED' ? 'MORE INFO NEEDED' : status}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 font-bold shadow-sm">
                {error}
              </div>
            )}

            {/* DATA TABLE */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-action"></div>
              </div>
            ) : displayedRequests.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg">No requests found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
                        <th className="px-6 py-4 rounded-tl-2xl">Student ID</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Amount (Rs)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedRequests.map((req: any) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-5">
                            <p className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit">{req.beneficiaryId || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-900 text-sm capitalize">{req.category.replace(/_/g, ' ')}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-extrabold text-brand-action text-sm">Rs. {req.requestedAmount?.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                              req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                              req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                              req.status === 'MORE_INFORMATION_REQUIRED' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                              'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {req.status === 'MORE_INFORMATION_REQUIRED' ? 'MORE INFO NEEDED' : req.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => handleViewDetails(req)}
                              className="px-5 py-2.5 bg-brand-dark text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
                            >
                              Review Details
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

      {/* --- DETAILS MODAL --- */}
      {selectedRequest && !chatModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative animate-fade-in-down">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900">Request Verification</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-rose-500 font-bold text-3xl transition">&times;</button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Category:</span> 
                  <p className="font-extrabold text-slate-900 text-lg capitalize">{selectedRequest.category.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Requested Amount:</span> 
                  <p className="font-extrabold text-brand-action text-2xl">Rs. {selectedRequest.requestedAmount?.toLocaleString()}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 mt-2">
                  <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Story / Description:</span> 
                  <p className="text-slate-700 mt-1 text-sm bg-white p-4 rounded-xl border border-slate-200 leading-relaxed font-medium">
                    {selectedRequest.description || 'No description provided.'}
                  </p>
                </div>
                
                {selectedRequest.adminReason && (
                   <div className="col-span-1 sm:col-span-2 mt-2 bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                      <span className="text-indigo-800 text-xs font-extrabold uppercase tracking-wider">Previous Admin Notes:</span> 
                      <p className="text-indigo-900 mt-1 text-sm font-bold">{selectedRequest.adminReason}</p>
                   </div>
                )}
              </div>

              {/* Chat Button */}
              {selectedRequest.status === 'MORE_INFORMATION_REQUIRED' && (
                <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-indigo-900">Communication Thread</h4>
                    <p className="text-xs font-bold text-indigo-700 mt-1">Review student replies or missing documents.</p>
                  </div>
                  <button
                    onClick={() => openChat(selectedRequest.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md w-full sm:w-auto"
                  >
                    Open Messages
                  </button>
                </div>
              )}

              {/* Documents Display */}
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                <h4 className="font-extrabold text-amber-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Student Uploaded Proofs
                </h4>
                {docsLoading ? (
                  <p className="text-sm text-amber-700 animate-pulse font-bold">Loading documents securely...</p>
                ) : documents.length === 0 ? (
                  <p className="text-sm text-rose-600 font-extrabold bg-rose-50 p-3 rounded-lg border border-rose-100">⚠️ No documents found. Action required.</p>
                ) : (
                  <ul className="space-y-3">
                    {documents.map((doc: any) => (
                      <li key={doc.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                        <span className="font-extrabold text-slate-700 text-sm uppercase">{doc.docType.replace(/_/g, ' ')}</span>
                        <a 
                          href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `http://localhost:5000${doc.fileUrl.startsWith('/') ? '' : '/'}${doc.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-brand-action text-white px-5 py-2.5 rounded-lg hover:opacity-90 font-bold shadow-sm whitespace-nowrap"
                        >
                          View Document
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {(selectedRequest.status === 'PENDING' || selectedRequest.status === 'MORE_INFORMATION_REQUIRED') && (
              <div className="mt-6 mb-4">
                <label className="block text-sm font-extrabold text-slate-700 mb-2">
                  Admin Verdict / Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={adminReason}
                  onChange={(e) => { setAdminReason(e.target.value); setReasonError(''); }}
                  placeholder="Explain why this request is approved, rejected, or needs more info..."
                  className={`w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 text-sm font-medium transition-all resize-none shadow-inner ${
                    reasonError ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                  }`}
                  rows={3}
                />
                {reasonError && <p className="text-rose-600 text-xs mt-2 font-extrabold">{reasonError}</p>}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 mt-2">
              {selectedRequest.status === 'PENDING' && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                  <button
                    onClick={() => handleVerification(selectedRequest.id, 'REJECTED')}
                    className="py-3 bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold rounded-xl transition flex-1"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerification(selectedRequest.id, 'MORE_INFORMATION_REQUIRED')}
                    className="py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-extrabold rounded-xl transition flex-1"
                  >
                    Need More Docs
                  </button>
                  <button
                    onClick={() => handleVerification(selectedRequest.id, 'APPROVED')}
                    className="py-3 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md font-extrabold rounded-xl transition flex-1"
                  >
                    Approve
                  </button>
                </div>
              )}

              {selectedRequest.status === 'REJECTED' && (
                <button
                  onClick={() => handleVerification(selectedRequest.id, 'PENDING')}
                  className="py-3 px-6 bg-amber-500 text-white hover:bg-amber-600 shadow-md font-extrabold rounded-xl transition w-full sm:w-auto"
                >
                  Re-Evaluate Request
                </button>
              )}

              {selectedRequest.status === 'APPROVED' && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                  <button
                    onClick={() => handleVerification(selectedRequest.id, 'PENDING')}
                    className="py-3 px-6 bg-slate-100 text-slate-700 hover:bg-slate-200 font-extrabold rounded-xl transition flex-1"
                  >
                    Cancel Approval
                  </button>
                  {!selectedRequest.campaign ? (
                    <button
                      onClick={handleOpenCampaignForm}
                      className="py-3 px-6 font-extrabold rounded-xl shadow-md transition bg-brand-primary text-brand-dark hover:opacity-90 flex-1"
                    >
                      Launch Live Campaign
                    </button>
                  ) : (
                    <span className="py-3 px-6 font-extrabold rounded-xl bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed flex-1 text-center">
                      Campaign is Live
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CAMPAIGN LAUNCH MODAL --- */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 relative animate-fade-in-down">
            <button onClick={() => setShowCampaignModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 font-bold text-3xl transition">&times;</button>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2 border-b border-slate-100 pb-4 pr-8">Publish Campaign</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Edit the details below before making this campaign public to donors.</p>
            
            <form onSubmit={handleLaunchCampaign} className="space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Campaign Title</label>
                <input 
                  type="text" required value={campaignData.title} onChange={(e) => setCampaignData({...campaignData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-bold transition-all shadow-inner" 
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Target Amount (Rs)</label>
                <input 
                  type="number" required value={campaignData.targetAmount} onChange={(e) => setCampaignData({...campaignData, targetAmount: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-bold transition-all shadow-inner" 
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Campaign Story</label>
                <textarea 
                  required rows={4} value={campaignData.description} onChange={(e) => setCampaignData({...campaignData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-medium transition-all resize-none shadow-inner" 
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-1.5">Deadline</label>
                <input 
                  type="date" required value={campaignData.deadline} onChange={(e) => setCampaignData({...campaignData, deadline: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-action bg-slate-50 focus:bg-white text-sm font-bold transition-all shadow-inner" 
                />
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <button type="submit" disabled={campaignLoading} className="w-full py-3.5 bg-brand-action text-white hover:opacity-90 font-extrabold rounded-xl shadow-lg transition-all disabled:opacity-50 text-base">
                  {campaignLoading ? 'Launching...' : 'Go Live Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADMIN CHAT MODAL --- */}
      {chatModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col h-[85vh] relative animate-fade-in-down overflow-hidden">
            <div className="p-6 bg-indigo-900 text-white shrink-0 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold">Student Support Chat</h3>
                <p className="text-xs text-indigo-200 mt-1 font-medium">Request missing documents or provide updates.</p>
              </div>
              <button onClick={() => setChatModalOpen(false)} className="text-indigo-200 hover:text-white font-bold text-3xl transition">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-5">
              {loadingMessages ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-action"></div></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10 font-bold bg-white p-6 rounded-2xl border border-slate-200 mx-10 shadow-sm">
                  No messages yet. Send a message to the student.
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isAdmin = msg.sender.role === 'ADMIN';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${!isAdmin ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                        <span className={`text-[10px] uppercase font-extrabold block mb-2 ${!isAdmin ? 'text-indigo-600' : 'text-indigo-200'}`}>
                          {isAdmin ? 'You (Admin)' : 'Beneficiary'}
                        </span>
                        <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                        {msg.fileUrl && (
                          <a href={msg.fileUrl.startsWith('http') ? msg.fileUrl : `http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 mt-3 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${!isAdmin ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-white/20 text-white hover:bg-white/30'}`}
                          >
                            📎 View Attachment
                          </a>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1.5 font-bold px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 w-12 h-12 rounded-xl transition flex items-center justify-center border border-slate-200 shadow-inner shrink-0">
                    <input id="admin-file-upload" type="file" className="hidden" onChange={(e) => setNewAttachment(e.target.files ? e.target.files[0] : null)} />
                    <span className="text-xl">📎</span>
                  </label>
                  <input 
                    type="text" placeholder="Type instructions here..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-bold transition-all shadow-inner"
                  />
                  <button type="submit" disabled={sendingMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-extrabold transition shadow-md disabled:opacity-50 shrink-0">
                    {sendingMessage ? '...' : 'Send'}
                  </button>
                </div>
                {newAttachment && (
                  <div className="text-xs font-bold text-indigo-700 bg-indigo-50 inline-block px-3 py-1.5 rounded-lg border border-indigo-200 ml-16">
                    📎 {newAttachment.name}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}