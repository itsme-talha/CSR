"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api'; 

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DONOR'); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState<{name?: string, email?: string, password?: string}>({});

  // === Form Validation (Logic remains exactly the same) ===
  const validateForm = () => {
    let isValid = true;
    const errors: {name?: string, email?: string, password?: string} = {};

    if (!name.trim()) {
      errors.name = "Full Name is required.";
      isValid = false;
    } else if (name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email address is required.";
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g., student@comsats.edu.pk).";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return; 
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (response.data.success) {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Main Wrapper: Full screen without standard navbar/footer */
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans">
      
      {/* Modern Split-Screen Card */}
      <div className="flex w-full max-w-6xl h-[90vh] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* === LEFT SIDE: Brand Image & Message (Hidden on Mobile) === */}
        <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-brand-dark text-white p-12 overflow-hidden">
          
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>

          {/* Top Navbar inside the image */}
          <div className="relative z-10 flex justify-between items-center w-full">
             <div className="font-extrabold text-3xl tracking-tight">Charity<span className="text-brand-primary">Hub</span></div>
             <Link href="/" className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md transition-all">
                &larr; Back to website
             </Link>
          </div>

          {/* Bottom Engaging Text */}
          <div className="relative z-10 mb-8">
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5">
              Empowering Students,<br />Building Futures.
            </h2>
            <p className="text-brand-light/90 text-lg font-medium max-w-md">
              Join our platform to request financial assistance or become a donor to help students achieve their dreams.
            </p>
          </div>
        </div>

        {/* === RIGHT SIDE: Registration Form === */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-20 overflow-y-auto bg-white">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden flex justify-between items-center mb-10 w-full pt-8">
             <div className="font-extrabold text-2xl text-brand-dark tracking-tight">Charity<span className="text-brand-action">Hub</span></div>
             <Link href="/" className="text-sm font-bold text-slate-500 hover:text-brand-action transition-colors">
               &larr; Home
             </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-3 text-base text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-action font-bold hover:underline transition-all">
                Log in
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister} noValidate>
            
            {/* Global API Error */}
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                <p className="text-sm font-bold text-rose-700">{error}</p>
              </div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name" name="name" type="text" required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationErrors.name) setValidationErrors({...validationErrors, name: ''});
                }}
                className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all ${
                  validationErrors.name 
                    ? 'bg-rose-50 border border-rose-200 text-rose-900 focus:ring-2 focus:ring-rose-500' 
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-action focus:border-transparent'
                }`}
                placeholder="Enter your full name"
              />
              {validationErrors.name && <p className="mt-1.5 text-xs font-bold text-rose-500">{validationErrors.name}</p>}
            </div>

            {/* Email Input */}
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
                placeholder="student@comsats.edu.pk"
              />
              {validationErrors.email && <p className="mt-1.5 text-xs font-bold text-rose-500">{validationErrors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="password" name="password" type="password" required autoComplete="new-password"
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
                placeholder="Minimum 8 characters"
              />
              {validationErrors.password && <p className="mt-1.5 text-xs font-bold text-rose-500">{validationErrors.password}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-slate-700 mb-1.5">
                I want to register as a
              </label>
              <select
                id="role" name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-action cursor-pointer transition-all"
              >
                <option value="DONOR">Donor (I want to donate)</option>
                <option value="BENEFICIARY">Beneficiary (I need assistance)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2 pb-8 lg:pb-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-brand-action hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-action transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create account'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}