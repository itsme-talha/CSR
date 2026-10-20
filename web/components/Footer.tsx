"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on Login, Register, and Dashboard pages
  const isHidden = pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard');

  if (isHidden) {
    return null;
  }

  return (
    <footer className="bg-brand-dark text-slate-300 py-16 mt-auto w-full border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Charity<span className="text-brand-action">Hub</span>
            </h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Empowering students and building better futures through transparent and direct financial assistance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-brand-action transition-colors">Home</Link></li>
              <li><Link href="/campaigns" className="hover:text-brand-action transition-colors">Active Campaigns</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-action transition-colors">How It Works</Link></li>
              <li><Link href="/impact" className="hover:text-brand-action transition-colors">Our Impact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/faq" className="hover:text-brand-action transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-brand-action transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-action transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-action transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <span className="text-brand-action">📍</span>
                <span>COMSATS University Islamabad, Vehari Campus</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-action">✉️</span>
                <a href="mailto:support@charityhub.com" className="hover:text-brand-action transition-colors">support@charityhub.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} Charity Hub. All rights reserved.</p>
          <p>Developed for a better future.</p>
        </div>
        
      </div>
    </footer>
  );
}