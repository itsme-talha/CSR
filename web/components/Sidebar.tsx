"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  userRole: 'ADMIN' | 'DONOR' | 'BENEFICIARY';
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ userRole, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Resizable Width State (Default 256px = 64rem)
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isResizing = useRef(false);

  // Constants for min/max width
  const MIN_WIDTH = 80;  // Collapsed state
  const MAX_WIDTH = 320; // Max expanded state

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Beneficiaries', path: '/dashboard/admin/beneficiaries', icon: 'M12 14l9-5-9-5-9 5 9 5z' }, 
    { name: 'Requests', path: '/dashboard/admin/requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Campaigns', path: '/dashboard/admin/campaigns', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { name: 'Verify Donations', path: '/dashboard/admin/donations', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const donorLinks = [ 
    { name: 'Dashboard', path: '/dashboard/donor', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Active Campaigns', path: '/dashboard/donor/campaigns', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { name: 'Donation History', path: '/dashboard/donor/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];
  const beneficiaryLinks = [ 
    { name: 'Dashboard', path: '/dashboard/beneficiary', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'My Profile', path: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'New Request', path: '/dashboard/request', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Documents', path: '/dashboard/upload', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { name: 'Track Status', path: '/dashboard/beneficiary/status', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
  ];
  const linksToUse = userRole === 'ADMIN' ? adminLinks : userRole === 'DONOR' ? donorLinks : beneficiaryLinks;

  // === RESIZE LOGIC ===
  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize'; // Change cursor globally while dragging
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      let newWidth = e.clientX;
      if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
      if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
      setSidebarWidth(newWidth);
    };

    const stopResizing = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      
      // Auto-snap logic: Agar width 120px se kam ho gayi toh usay mukammal collapse kar do (80px)
      setSidebarWidth((prev) => (prev < 120 ? MIN_WIDTH : prev));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  const isCollapsed = sidebarWidth === MIN_WIDTH;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* Main Sidebar Wrapper */}
      <div className="relative z-50 flex h-full shrink-0">
        <aside 
          style={{ width: isMobileOpen ? 256 : sidebarWidth }} // Mobile par fixed, desktop par draggable
          className={`
            fixed md:static inset-y-0 left-0 
            bg-brand-dark text-gray-300 flex flex-col transition-transform duration-300 ease-in-out md:transition-none
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 shrink-0 overflow-hidden">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 shrink-0 bg-brand-primary text-brand-dark rounded-lg flex items-center justify-center font-extrabold text-lg">CH</div>
              {!isCollapsed && (
                <div className="whitespace-nowrap opacity-100 transition-opacity overflow-hidden">
                  <span className="text-sm font-bold text-white block leading-tight">Charity Hub</span>
                  <span className="text-xs text-brand-light/70 capitalize">{userRole.toLowerCase()} Panel</span>
                </div>
              )}
            </div>
            
            {/* Mobile Close Button */}
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-1 hover:bg-white/10 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar overflow-x-hidden">
            {linksToUse.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} href={link.path} onClick={() => setIsMobileOpen(false)} title={isCollapsed ? link.name : ''}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors whitespace-nowrap
                    ${isActive ? 'bg-brand-action/20 text-brand-primary font-bold border border-brand-action/30' : 'hover:bg-white/5 hover:text-white border border-transparent'}
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-white/10 mb-2 mt-auto shrink-0">
            <button 
              onClick={handleLogout} title={isCollapsed ? 'Logout' : ''}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl font-medium text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Drag Handle (The Resizer Bar) */}
        <div 
          onMouseDown={startResizing}
          className="hidden md:flex w-1 bg-transparent hover:bg-brand-action cursor-col-resize h-full absolute right-0 top-0 z-50 transition-colors"
          title="Drag to resize"
        ></div>
      </div>
    </>
  );
}