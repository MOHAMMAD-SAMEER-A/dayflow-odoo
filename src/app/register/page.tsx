"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHRMS } from '../../context/HRMSContext';
import { 
  Activity, 
  Upload, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Briefcase, 
  ShieldAlert 
} from 'lucide-react';

export default function RegisterPage() {
  const { registerCompany } = useHRMS();
  const router = useRouter();

  // Form States
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visual toggles
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName || !adminName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      registerCompany(companyName, adminName, email, phone, password);
      router.push('/');
    } catch (e) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 py-12 relative">
      
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-10 select-none">
        <h1 className="text-2xl sm:text-3xl font-normal text-[#e2e8f0] tracking-widest font-mono">
          Human Resource Management System
        </h1>
        <div className="w-24 h-0.5 bg-indigo-500/30 mx-auto mt-3 rounded-full" />
      </div>

      {/* Registration Card (Wireframe Box Style) */}
      <div className="w-full max-w-lg bg-[#131b2e] border-2 border-white/10 rounded-2xl p-8 shadow-2xl relative">
        
        {/* Top of Box Title */}
        <div className="absolute -top-3.5 left-6 bg-[#090d16] px-4 py-0.5 border border-white/10 rounded-full text-xs font-semibold text-gray-400">
          Sign Up Page
        </div>

        {/* Mock App/Web Logo container */}
        <div className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-5 flex flex-col items-center justify-center gap-1.5 mb-6">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">App/Web Logo</span>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-start gap-2 mb-6">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field: Company Name + Mock Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Company Name :-
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Odoo India"
                />
              </div>

              {/* Upload Logo blue button slot */}
              <div className="relative">
                <input 
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoUploaded(true);
                      setLogoName(file.name);
                    }
                  }}
                />
                <button 
                  type="button"
                  title="Upload Company Logo"
                  className={`px-3 py-2 rounded-lg text-white border text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    logoUploaded 
                      ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-indigo-600 border-indigo-500'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-xs font-semibold hidden sm:inline">{logoUploaded ? "Uploaded" : "Upload Logo"}</span>
                </button>
              </div>
            </div>
            {logoUploaded && (
              <span className="block text-[10px] text-emerald-400 italic">File: {logoName}</span>
            )}
          </div>

          {/* Field: Admin Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Name :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Mohammad Sameer"
              />
            </div>
          </div>

          {/* Field: Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Email :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m.sameer@company.com"
              />
            </div>
          </div>

          {/* Field: Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Phone :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
              />
            </div>
          </div>

          {/* Field: Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Password :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type={showPass ? 'text' : 'password'} 
                required
                className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-10 py-2 text-sm focus:border-indigo-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Field: Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Confirm Password :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type={showConfirmPass ? 'text' : 'password'} 
                required
                className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-10 py-2 text-sm focus:border-indigo-500 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Purple Button: Sign Up */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-sm tracking-wide py-2.5 rounded-lg transition-all shadow-lg mt-6 active:scale-98"
          >
            Sign Up
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <span>Already have an account? </span>
          <Link href="/login" className="text-purple-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>

      </div>

    </div>
  );
}
