"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string}>({});

  const validateForm = () => {
    let isValid = true;
    const errors: {email?: string, password?: string} = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email address is required.";
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email (e.g., admin@comsats.edu.pk).";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return; 
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', response.data.data.role);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans">
      
      <div className="flex w-full max-w-6xl h-[90vh] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* === LEFT SIDE: Wahi Same Register Wali Image === */}
        <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-brand-dark text-white p-12 overflow-hidden">
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>

          <div className="relative z-10 flex justify-between items-center w-full">
             <div className="font-extrabold text-3xl tracking-tight">Charity<span className="text-brand-primary">Hub</span></div>
             <Link href="/" className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md transition-all">
                &larr; Back to website
             </Link>
          </div>

          <div className="relative z-10 mb-8">
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5">
              Welcome Back.
            </h2>
            <p className="text-brand-light/90 text-lg font-medium max-w-md">
              Sign in to continue making a difference. Access your dashboard to manage requests, donations, and campaigns.
            </p>
          </div>
        </div>

        {/* === RIGHT SIDE: Login Form === */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-20 overflow-y-auto bg-white">
          
          <div className="lg:hidden flex justify-between items-center mb-10 w-full pt-8">
             <div className="font-extrabold text-2xl text-brand-dark tracking-tight">Charity<span className="text-brand-action">Hub</span></div>
             <Link href="/" className="text-sm font-bold text-slate-500 hover:text-brand-action transition-colors">
               &larr; Home
             </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sign in
            </h2>
            <p className="mt-3 text-base text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link href="/register" className="text-brand-action font-bold hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin} noValidate>
            
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                <p className="text-sm font-bold text-rose-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">
                Email address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors({...validationErrors, email: ''});
                }}
                className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all ${
                  validationErrors.email 
                    ? 'bg-rose-50 border border-rose-200 text-rose-900 focus:ring-2 focus:ring-rose-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-action focus:border-transparent'
                }`}
                placeholder="admin@comsats.edu.pk"
              />
              {validationErrors.email && <p className="mt-1.5 text-xs font-bold text-rose-500">{validationErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="password" name="password" type="password" required autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors({...validationErrors, password: ''});
                }}
                className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all ${
                  validationErrors.password 
                    ? 'bg-rose-50 border border-rose-200 text-rose-900 focus:ring-2 focus:ring-rose-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-action focus:border-transparent'
                }`}
                placeholder="••••••••"
              />
              {validationErrors.password && <p className="mt-1.5 text-xs font-bold text-rose-500">{validationErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me" name="remember-me" type="checkbox"
                  className="h-4 w-4 text-brand-action focus:ring-brand-action border-slate-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-brand-action hover:underline transition-all">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-4 pb-8 lg:pb-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-brand-action hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-action transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}