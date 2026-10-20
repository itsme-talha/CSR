"use client";

import Link from 'next/link';

export default function ImpactPage() {
  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight sm:text-5xl transition-colors duration-500">
            Our <span className="text-brand-action transition-colors duration-500">Impact</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Dekhein kaisay aapki chhoti si madad COMSATS University ke students ke mustaqbil ko roshan kar rahi hai.
          </p>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-brand-primary hover:shadow-md transition-all duration-300">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-4xl font-extrabold text-brand-action mb-2 transition-colors duration-500">1,250+</h3>
            <p className="text-slate-600 font-medium">Students Supported</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-brand-primary hover:shadow-md transition-all duration-300">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-4xl font-extrabold text-brand-action mb-2 transition-colors duration-500">PKR 4.5M+</h3>
            <p className="text-slate-600 font-medium">Total Funds Distributed</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-brand-primary hover:shadow-md transition-all duration-300">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-4xl font-extrabold text-brand-action mb-2 transition-colors duration-500">85+</h3>
            <p className="text-slate-600 font-medium">Medical Cases Solved</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:border-brand-primary hover:shadow-md transition-all duration-300">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-4xl font-extrabold text-brand-action mb-2 transition-colors duration-500">175</h3>
            <p className="text-slate-600 font-medium">Campaigns Completed</p>
          </div>
        </div>

        {/* Transparency Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12 transition-colors duration-500">
          <h3 className="text-3xl font-extrabold text-brand-dark mb-6 text-center transition-colors duration-500">100% Transparency Commitment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Hamara system mukammal taur par shafaf (transparent) hai. Har ek rupiya jo aap donate karte hain, wo direct verify hone ke baad zaroorat-mand student ya university ke official account mein transfer kiya jata hai.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✔</span>
                  <span className="text-slate-700">Koi hidden fees ya deduction nahi.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✔</span>
                  <span className="text-slate-700">Donors ko unki payment ka utilization proof diya jata hai.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✔</span>
                  <span className="text-slate-700">Students ki privacy ka mukammal khayal (No private data exposed).</span>
                </li>
              </ul>
            </div>
            <div className="bg-brand-light p-8 rounded-xl border border-brand-primary/20 transition-colors duration-500">
              <h4 className="text-xl font-bold text-brand-dark mb-4 transition-colors duration-500">Current Fund Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-brand-primary/20 pb-2 transition-colors duration-500">
                  <span className="text-slate-600">Funds Collected (2026)</span>
                  <span className="font-bold text-slate-900">PKR 4,500,000</span>
                </div>
                <div className="flex justify-between border-b border-brand-primary/20 pb-2 transition-colors duration-500">
                  <span className="text-slate-600">Funds Distributed</span>
                  <span className="font-bold text-slate-900">PKR 3,900,000</span>
                </div>
                <div className="flex justify-between text-brand-action transition-colors duration-500 mt-4">
                  <span className="font-bold">Currently Available for Active Cases</span>
                  <span className="font-bold">PKR 600,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}