"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide Navbar on Login, Register, and Dashboard pages
  const isHidden = pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [pathname]); // Pathname change hone par state re-check karein

  if (isHidden) {
    return null; 
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Charity<span className="text-brand-action">Hub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-brand-action transition-colors">Home</Link>
            <Link href="/campaigns" className="text-sm font-bold text-slate-600 hover:text-brand-action transition-colors">Campaigns</Link>
            <Link href="/how-it-works" className="text-sm font-bold text-slate-600 hover:text-brand-action transition-colors">How it Works</Link>
            <Link href="/impact" className="text-sm font-bold text-slate-600 hover:text-brand-action transition-colors">Impact</Link>
            <Link href="/about" className="text-sm font-bold text-slate-600 hover:text-brand-action transition-colors">About Us</Link>
            <Link href="/faq" className="text-sm font-bold text-slate-600 hover:text-brand-action transition-colors">FAQ</Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-6 py-2.5 bg-brand-action text-white text-sm font-bold rounded-full hover:bg-brand-action/90 transition-all shadow-md hover:shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-brand-action transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="px-6 py-2.5 bg-brand-action text-white text-sm font-bold rounded-full hover:bg-brand-action/90 transition-all shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/" className="block px-3 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-lg">Home</Link>
            <Link href="/campaigns" className="block px-3 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-lg">Campaigns</Link>
            <Link href="/about" className="block px-3 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-lg">About Us</Link>
            <div className="pt-4 flex flex-col gap-3 px-3">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full text-center px-6 py-3 bg-brand-action text-white font-bold rounded-xl shadow-md">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="w-full text-center px-6 py-3 bg-slate-100 text-slate-800 font-bold rounded-xl">
                    Log in
                  </Link>
                  <Link href="/register" className="w-full text-center px-6 py-3 bg-brand-action text-white font-bold rounded-xl shadow-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}