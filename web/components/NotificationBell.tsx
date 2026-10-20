"use client";

import { useState, useEffect } from "react";
import api from '@/services/api';

interface Notification {
  id: number;
  text: string;
  time: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications'); 
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const toggleDropdown = () => setIsOpen(!isOpen);

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    try {
      await api.post('/notifications/mark-read'); 
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  return (
    <div className="relative inline-block text-left">
      
      {/* Bell Button */}
      <button 
        onClick={toggleDropdown}
        className="relative p-2.5 text-slate-500 hover:text-brand-action hover:bg-slate-100 transition-all rounded-full focus:outline-none"
        aria-label="View notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-extrabold text-white bg-rose-500 rounded-full border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Modern Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-down">
          
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="text-xs font-bold text-brand-action hover:opacity-80 transition-opacity"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
             {notifications.length > 0 ? (
                 notifications.map(n => (
                     <div key={n.id} className={`p-4 border-b border-slate-50 text-sm transition-colors ${n.isRead ? 'bg-white' : 'bg-brand-light/30'}`}>
                         <p className={`font-medium ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{n.text}</p>
                         {n.time && <p className="text-[11px] text-slate-400 mt-1 font-semibold">{n.time}</p>}
                     </div>
                 ))
             ) : (
                 <div className="p-8 text-sm text-slate-400 text-center font-medium">
                    No new notifications
                 </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}