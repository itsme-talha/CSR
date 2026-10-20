"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan backend API call aayegi message send karne ke liye
    setStatus({ type: 'success', message: 'Aapka message successfully send ho gaya hai. Hum jald rabta karenge.' });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight sm:text-5xl transition-colors duration-500">
            Contact <span className="text-brand-action transition-colors duration-500">Us</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Kisi bhi maloomat, feedback, ya system support ke liye humari admin team se direct rabta karein.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-colors duration-500">
            <h3 className="text-2xl font-bold text-brand-dark mb-6 transition-colors duration-500">Admin Contact Details</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-light p-3 rounded-lg text-brand-action text-xl transition-colors duration-500">📍</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-slate-900">University Campus</h4>
                  <p className="text-slate-500 mt-1">COMSATS University Islamabad, Vehari Campus.<br/>Punjab, Pakistan.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-light p-3 rounded-lg text-brand-action text-xl transition-colors duration-500">💬</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-slate-900">WhatsApp Support (Admin)</h4>
                  <p className="text-slate-500 mt-1">+92 300 1234567</p>
                  <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="text-brand-action text-sm font-semibold hover:opacity-80 transition-colors duration-300 mt-1 inline-block">
                    Chat on WhatsApp &rarr;
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-light p-3 rounded-lg text-brand-action text-xl transition-colors duration-500">✉️</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-slate-900">Official Email</h4>
                  <p className="text-slate-500 mt-1">support@charityhub.edu.pk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-colors duration-500">
            <h3 className="text-2xl font-bold text-brand-dark mb-6 transition-colors duration-500">Send a Message</h3>
            
            {status.message && (
              <div className={`p-4 mb-6 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" required className="mt-1 block w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-brand-action focus:border-transparent outline-none transition-all duration-300" placeholder="Ali Khan" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" required className="mt-1 block w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-brand-action focus:border-transparent outline-none transition-all duration-300" placeholder="ali@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Subject</label>
                <input type="text" required className="mt-1 block w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-brand-action focus:border-transparent outline-none transition-all duration-300" placeholder="How to verify my application?" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea required rows={4} className="mt-1 block w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-brand-action focus:border-transparent outline-none transition-all duration-300" placeholder="Your message here..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-action hover:opacity-90 transition-all duration-500">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}