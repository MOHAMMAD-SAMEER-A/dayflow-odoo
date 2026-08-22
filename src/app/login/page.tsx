"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHRMS } from '../../context/HRMSContext';
import { Activity, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { login } = useHRMS();
  const router = useRouter();
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrId || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = login(emailOrId, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid login credentials. Note: Use any mock email (e.g. m.sameer@odoo.com) or Employee ID.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 relative">
      
      {/* Hand-drawn style background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Wireframe Header */}
      <div className="text-center mb-10 select-none">
        <h1 className="text-2xl sm:text-3xl font-normal text-[#e2e8f0] tracking-widest font-mono" style={{ fontFamily: 'var(--font-sans)' }}>
          Human Resource Management System
        </h1>
        <div className="w-24 h-0.5 bg-indigo-500/30 mx-auto mt-3 rounded-full" />
      </div>

      {/* Sign in Card (Wireframe Box Style) */}
      <div className="w-full max-w-md bg-[#131b2e] border-2 border-white/10 rounded-2xl p-8 shadow-2xl relative">
        
        {/* Top of Box Title */}
        <div className="absolute -top-3.5 left-6 bg-[#090d16] px-4 py-0.5 border border-white/10 rounded-full text-xs font-semibold text-gray-400">
          Sign in Page
        </div>

        {/* Mock App/Web Logo container */}
        <div className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-5 flex flex-col items-center justify-center gap-1.5 mb-8">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Field: Login ID / Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Login Id/Email :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-[#0f172a]/60 border-2 border-white/10 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all font-mono"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="m.sameer@odoo.com"
              />
            </div>
          </div>

          {/* Field: Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Password :-
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-[#0f172a]/60 border-2 border-white/10 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Purple Button: SIGN IN */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold tracking-widest text-sm uppercase py-3 rounded-xl transition-all shadow-lg active:scale-98"
          >
            SIGN IN
          </button>
        </form>

        {/* Footer text link */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <span>Don't have an Account? </span>
          <Link href="/register" className="text-purple-400 hover:underline font-semibold">
            Sign Up
          </Link>
        </div>

      </div>

    </div>
  );
}
