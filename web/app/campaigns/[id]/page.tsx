"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params.id;
  
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await api.get(`/public/campaigns/${id}`);
        if (response.data.success) {
          setCampaign(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching campaign details', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

  const calculateProgress = (raised: number, target: number) => {
    if (!target || target === 0) return 0;
    const percentage = (raised / target) * 100;
    return percentage > 100 ? 100 : Math.round(percentage);
  };

  if (loading) {
    return (
      <div className="flex-grow flex justify-center items-center transition-colors duration-500 ease-in-out py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-action transition-colors duration-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center transition-colors duration-500 ease-in-out py-32">
        <h2 className="text-2xl font-bold text-brand-dark mb-4 transition-colors duration-500">Campaign Not Found</h2>
        <Link href="/campaigns" className="text-brand-action hover:opacity-80 transition-colors duration-500">
          &larr; Back to Campaigns
        </Link>
      </div>
    );
  }

  const progress = calculateProgress(campaign.collectedAmount, campaign.targetAmount);

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/campaigns" className="text-slate-500 hover:text-brand-action flex items-center gap-2 font-medium transition-colors duration-300">
            &larr; Back to all campaigns
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Campaign Description */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1 bg-brand-light text-brand-action text-sm font-bold rounded-full uppercase tracking-wider transition-colors duration-500">
                {campaign.category || 'Support'}
              </span>
              <span className="px-4 py-1 border border-brand-action text-brand-action text-sm font-bold rounded-full uppercase tracking-wider transition-colors duration-500">
                {campaign.status}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-6 leading-tight transition-colors duration-500">
              {campaign.title}
            </h1>
            
            <div className="prose max-w-none text-slate-600 text-lg leading-relaxed">
              <h3 className="text-xl font-bold text-brand-dark mb-3 border-b border-slate-200 pb-2 transition-colors duration-500">About the Request</h3>
              <p className="whitespace-pre-wrap">{campaign.description}</p>
            </div>
            
            <div className="mt-10 p-6 bg-brand-light rounded-xl border border-brand-primary/20 transition-colors duration-500">
              <h4 className="font-bold text-brand-dark mb-2 transition-colors duration-500">Transparency Note</h4>
              <p className="text-sm text-slate-600">
                Is campaign mein aane wale tamaam funds directly COMSATS University ki verification team ke through utilize kiye jayenge. Donors ko fund transfer ki official receipt system mein provide ki jayegi.
              </p>
            </div>
          </div>

          {/* Right Side: Donation Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 sticky top-28 transition-colors duration-500">
              <h3 className="text-lg font-bold text-brand-dark mb-4 transition-colors duration-500">Funding Progress</h3>
              
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-extrabold text-brand-action transition-colors duration-500">
                    Rs. {campaign.collectedAmount?.toLocaleString() || 0}
                  </span>
                  <span className="text-slate-500 font-medium mb-1">raised</span>
                </div>
                <div className="text-slate-500 font-medium mb-4">
                  of Rs. {campaign.targetAmount?.toLocaleString()} goal
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-brand-action h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm font-bold text-slate-600">
                  {progress}% Complete
                </div>
              </div>

              {/* Login check for donation */}
              <Link 
                href="/login" 
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-brand-action hover:opacity-90 transition-all duration-500 hover:-translate-y-1"
              >
                Donate Now
              </Link>
              
              <p className="text-center text-sm text-slate-500 mt-4">
                Donate karne ke liye pehle apna account login karein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}