"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Sidebar from '@/components/Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DocumentUploadPage() {
  const router = useRouter();
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const docsList = [
    { id: 'CNIC_FRONT', apiType: 'CNIC_FRONT', title: 'CNIC (Front)', required: true },
    { id: 'CNIC_BACK', apiType: 'CNIC_BACK', title: 'CNIC (Back)', required: true },
    { id: 'STUDENT_CARD', apiType: 'STUDENT_CARD', title: 'University Student Card', required: true },
    { id: 'FEE_VOUCHER', apiType: 'FEE_VOUCHER', title: 'Unpaid Fee Voucher / Bill', required: true },
    { id: 'INCOME_PROOF', apiType: 'INCOME_PROOF', title: 'Guardian Income Proof', required: false },
  ];

  const handleUpload = async (docId: string, apiType: string, file: File | undefined, setUploading: (val: boolean) => void) => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', apiType);

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success || response.status === 200 || response.status === 201) {
        setUploadedDocs((prev) => [...prev, docId]);
      }
    } catch (err: any) {
      console.error("Upload Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Upload failed. Please check the file format or try again later.';
      alert(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const DocUploaderRow = ({ doc }: { doc: typeof docsList[0] }) => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isUploading, setIsUploading] = useState(false);
    const isUploaded = uploadedDocs.includes(doc.id);

    return (
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all shadow-sm ${isUploaded ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-brand-action/30'}`}>
        <div>
          <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm md:text-base">
            {doc.title}
            {doc.required ? (
              <span className="text-[10px] bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest border border-rose-200">Required</span>
            ) : (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest border border-slate-200">Optional</span>
            )}
          </h4>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">Format: JPG, PNG, PDF (Max 5MB)</p>
        </div>

        {isUploaded ? (
          <div className="text-emerald-700 font-extrabold bg-emerald-100 border border-emerald-200 px-6 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm w-full md:w-auto justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            Uploaded Successfully
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <label className={`w-full sm:w-auto text-sm py-2.5 px-4 rounded-xl border border-slate-300 bg-white font-bold cursor-pointer hover:bg-slate-50 transition-colors shadow-inner flex items-center justify-center gap-2 text-slate-700 ${selectedFile ? 'border-brand-action ring-1 ring-brand-action bg-brand-light/20 text-brand-dark' : ''}`}>
              <span className="truncate max-w-[150px]">{selectedFile ? selectedFile.name : 'Choose File...'}</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => handleUpload(doc.id, doc.apiType, selectedFile, setIsUploading)}
              disabled={!selectedFile || isUploading}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-extrabold text-white transition-all shadow-sm text-sm ${
                !selectedFile || isUploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-action hover:opacity-90 hover:shadow-md'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const requiredDocsCount = docsList.filter(d => d.required).length;
  const uploadedRequiredCount = uploadedDocs.filter(id => docsList.find(d => d.id === id)?.required).length;

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
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 relative animate-fade-in-down">
              
              <div className="mb-8 pr-4">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Required Documents</h2>
                <p className="text-sm text-slate-500 font-medium">Please upload the mandatory documents below to complete your application. Each file must be uploaded separately.</p>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {docsList.map((doc) => (
                  <DocUploaderRow key={doc.id} doc={doc} />
                ))}
              </div>

              {uploadedRequiredCount >= requiredDocsCount && (
                <div className="mt-8 p-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-extrabold text-center text-sm shadow-sm flex items-center justify-center gap-3">
                  <span className="text-2xl">🎉</span> 
                  Excellent! You have successfully uploaded all required documents. The Admin will now review your application.
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}