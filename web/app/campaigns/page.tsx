"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function PublicCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicCampaigns = async () => {
      try {
        const response = await api.get('/public/campaigns');
        if (response.data.success) {
          setCampaigns(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching campaigns', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicCampaigns();
  }, []);

  const calculateProgress = (raised: number, target: number) => {
    if (!target || target === 0) return 0;
    const percentage = (raised / target) * 100;
    return percentage > 100 ? 100 : Math.round(percentage);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ease-in-out font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight sm:text-5xl transition-colors duration-500">
            Active Campaigns
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            In campaigns ko support karein aur zaroorat-mand students ke future ko behtar banayein.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-action transition-colors duration-500"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-slate-200 transition-colors duration-500">
            <h3 className="text-xl font-medium text-brand-dark transition-colors duration-500">No Active Campaigns</h3>
            <p className="mt-2 text-slate-500">Filhaal koi public campaign live nahi hai. Please baad mein check karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((camp: any) => {
              const progress = calculateProgress(camp.collectedAmount || 0, camp.targetAmount);
              
              return (
                <div key={camp.id} className="bg-white flex flex-col rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-brand-light text-brand-action uppercase transition-colors duration-500">
                        {camp.category || 'Support'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Target: Rs. {camp.targetAmount}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {camp.title}
                    </h3>
                    
                    <p className="mt-3 text-sm text-slate-500 line-clamp-3 mb-6">
                      {camp.description}
                    </p>
                  </div>
                  
                  <div className="px-6 pb-6 mt-auto">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-brand-action transition-colors duration-500">Rs. {camp.collectedAmount || 0} Raised</span>
                        <span className="text-slate-500">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div 
                          className="bg-brand-action h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Updated Buttons Section */}
                    <div className="flex gap-3">
                      <Link 
                        href={`/campaigns/${camp.id}`} 
                        className="flex-1 text-center px-4 py-3 border border-slate-300 text-sm font-bold rounded-lg shadow-sm text-slate-700 bg-white hover:bg-slate-50 transition"
                      >
                        View Details
                      </Link>
                      <Link 
                        href="/login" 
                        className="flex-1 text-center px-4 py-3 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-brand-action hover:opacity-90 transition-all duration-500"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}