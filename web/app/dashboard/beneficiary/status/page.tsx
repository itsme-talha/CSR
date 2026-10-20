"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function ApplicationStatusPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Account detail submit states
  const [accountInputs, setAccountInputs] = useState<any>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Chat / Documents States
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/beneficiaries/my-requests');
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async (reqId: string) => {
    const details = accountInputs[reqId];
    if (!details || details.trim() === '') {
      alert("Please provide your accurate Bank or EasyPaisa details to proceed.");
      return;
    }

    setSubmittingId(reqId);
    try {
      const response = await api.put(`/beneficiaries/requests/${reqId}/account-details`, {
        accountDetails: details
      });
      
      if (response.data.success) {
        alert("Excellent! Your account details have been sent to the Admin.");
        fetchRequests(); 
      }
    } catch (err: any) {
      alert("Failed to submit details. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  const openChat = async (requestId: string) => {
    setActiveRequestId(requestId);
    setChatModalOpen(true);
    setLoadingMessages(true);
    setMessages([]); 

    try {
      const res = await api.get(`/messages/${requestId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() && !newAttachment) {
      alert("Please type a message or attach a document.");
      return;
    }

    setSendingMessage(true);
    try {
      const formData = new FormData();
      formData.append('requestId', activeRequestId!);
      formData.append('message', newMessageText);
      if (newAttachment) formData.append('document', newAttachment);

      const res = await api.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessages([...messages, res.data.data]);
        setNewMessageText('');
        setNewAttachment(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. RESIZABLE SIDEBAR COMPONENT */}
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
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Application Status</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Track the current progress of your financial assistance requests.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-action"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-slate-600 font-bold text-lg mb-4">You haven't submitted any requests yet.</p>
                <button 
                  onClick={() => router.push('/dashboard/request')}
                  className="px-8 py-3.5 bg-brand-action hover:bg-brand-action/90 text-white font-extrabold rounded-xl shadow-md transition-all hover:scale-105 text-sm"
                >
                  Start New Application
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {requests.map((req: any) => {
                  const isFunded = req.campaign && (req.campaign.collectedAmount >= req.campaign.targetAmount);

                  return (
                    <div key={req.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-extrabold text-xl text-slate-900 uppercase tracking-tight">{req.category.replace(/_/g, ' ')}</h3>
                          <span className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg uppercase tracking-widest shadow-sm ${
                            req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            req.status === 'MORE_INFORMATION_REQUIRED' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                            'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {req.status === 'MORE_INFORMATION_REQUIRED' ? 'MORE INFO NEEDED' : req.status}
                          </span>
                        </div>
                        
                        <p className="text-xs font-extrabold text-slate-500 mb-5 uppercase tracking-wide">
                          Applied: {new Date(req.submittedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        
                        <p className="text-sm text-slate-700 mb-6 line-clamp-3 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium">
                          {req.description}
                        </p>
                      </div>

                      <div>
                        <div className="pt-5 border-t border-slate-100 flex justify-between items-center mb-6">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Requested Amount</span>
                          <span className="font-extrabold text-brand-action text-xl">Rs. {req.requestedAmount?.toLocaleString()}</span>
                        </div>
                        
                        {/* Admin Feedback View */}
                        {req.adminReason && req.status !== 'MORE_INFORMATION_REQUIRED' && (
                          <div className={`mb-6 p-4 rounded-2xl border ${
                            req.status === 'REJECTED' ? 'bg-rose-50 border-rose-100' :
                            req.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100' :
                            'bg-slate-50 border-slate-200'
                          }`}>
                            <p className={`text-[10px] font-extrabold uppercase mb-1.5 ${req.status === 'REJECTED' ? 'text-rose-800' : req.status === 'APPROVED' ? 'text-emerald-800' : 'text-slate-500'}`}>Admin Feedback</p>
                            <p className={`text-sm font-bold ${req.status === 'REJECTED' ? 'text-rose-900' : req.status === 'APPROVED' ? 'text-emerald-900' : 'text-slate-800'}`}>"{req.adminReason}"</p>
                          </div>
                        )}

                        {/* Admin Demand (Chat Button) */}
                        {req.status === 'MORE_INFORMATION_REQUIRED' && (
                          <div className="mb-6 p-5 bg-indigo-50 border border-indigo-200 rounded-2xl shadow-sm">
                            <p className="text-xs text-indigo-800 font-extrabold mb-2 uppercase tracking-wide flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              Action Required
                            </p>
                            <p className="text-sm text-indigo-900 mb-5 font-bold">"{req.adminReason || "The Admin requires additional documents to proceed."}"</p>
                            <button
                              onClick={() => openChat(req.id)}
                              className="w-full py-3.5 bg-indigo-600 text-white font-extrabold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg text-sm"
                            >
                              Open Support Chat & Upload
                            </button>
                          </div>
                        )}

                        {/* Campaign Progress & Account Details Submission */}
                        {req.status === 'APPROVED' && req.campaign && (
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-2 shadow-inner">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-extrabold text-brand-action uppercase tracking-wide">Public Campaign</span>
                              <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                                Rs. {(req.campaign.collectedAmount || 0).toLocaleString()} / {(req.campaign.targetAmount).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-5 overflow-hidden">
                              <div 
                                className="bg-brand-action h-2.5 rounded-full transition-all duration-700" 
                                style={{ width: `${Math.min(((req.campaign.collectedAmount || 0) / (req.campaign.targetAmount || 1)) * 100, 100)}%` }}
                              ></div>
                            </div>

                            {/* Fund Goal Met -> Ask for Bank Details */}
                            {isFunded && !req.accountDetails && (
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-2">
                                <p className="text-xs text-blue-800 font-extrabold mb-3 leading-relaxed">
                                  🎉 Target reached! Please provide your Bank or EasyPaisa details so the Admin can transfer your funds.
                                </p>
                                <textarea
                                  rows={2}
                                  className="w-full p-3 text-sm font-bold border border-blue-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mb-3 bg-white shadow-inner resize-none placeholder:font-medium"
                                  placeholder="e.g. Meezan Bank, A/C: 123456789, Title: Ali Raza"
                                  value={accountInputs[req.id] || ''}
                                  onChange={(e) => setAccountInputs({...accountInputs, [req.id]: e.target.value})}
                                ></textarea>
                                <button
                                  onClick={() => handleAccountSubmit(req.id)}
                                  disabled={submittingId === req.id}
                                  className="w-full py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50"
                                >
                                  {submittingId === req.id ? 'Sending...' : 'Submit Details Safely'}
                                </button>
                              </div>
                            )}

                            {/* Details Sent -> Waiting for Transfer */}
                            {req.accountDetails && req.campaign.status !== 'COMPLETED' && (
                              <div className="mt-4 text-xs text-center text-blue-800 font-extrabold bg-blue-50 p-3.5 rounded-xl border border-blue-200 shadow-sm flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Details received. Waiting for Admin transfer.
                              </div>
                            )}

                            {/* Final State -> Completed & Disbursed */}
                            {req.campaign.status === 'COMPLETED' && (
                              <div className="mt-4 text-sm text-center text-emerald-800 font-extrabold bg-emerald-50 p-5 rounded-xl flex flex-col items-center gap-3 border border-emerald-200 shadow-sm">
                                <span className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                  Funds Transferred!
                                </span>
                                {req.campaign.disbursementProof && (
                                  <a 
                                    href={req.campaign.disbursementProof.startsWith('http') ? req.campaign.disbursementProof : `http://localhost:5000${req.campaign.disbursementProof.startsWith('/') ? '' : '/'}${req.campaign.disbursementProof}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md text-xs font-extrabold"
                                  >
                                    View Official Transfer Slip
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* === MODAL: SUPPORT CHAT / DOCUMENT UPLOAD === */}
      {chatModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col h-[85vh] relative animate-fade-in-down overflow-hidden">
            
            <div className="p-6 bg-indigo-900 text-white shrink-0 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold">Support Chat</h3>
                <p className="text-xs text-indigo-200 mt-1 font-medium">Provide requested documents or reply to Admin.</p>
              </div>
              <button onClick={() => setChatModalOpen(false)} className="text-indigo-200 hover:text-white font-bold text-3xl transition">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-5">
              {loadingMessages ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-action"></div></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10 font-bold bg-white p-6 rounded-2xl border border-slate-200 mx-10 shadow-sm">
                  No messages yet. Send a document or message to start.
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isAdmin = msg.sender.role === 'ADMIN';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${isAdmin ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                        <span className={`text-[10px] uppercase font-extrabold block mb-2 ${isAdmin ? 'text-indigo-600' : 'text-indigo-200'}`}>
                          {isAdmin ? 'Admin' : 'You'}
                        </span>
                        <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                        
                        {msg.fileUrl && (
                          <a href={msg.fileUrl.startsWith('http') ? msg.fileUrl : `http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 mt-3 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${isAdmin ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-white/20 text-white hover:bg-white/30'}`}
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
                    <input id="file-upload" type="file" className="hidden" onChange={(e) => setNewAttachment(e.target.files ? e.target.files[0] : null)} />
                    <span className="text-xl">📎</span>
                  </label>
                  <input 
                    type="text" placeholder="Type your reply here..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)}
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