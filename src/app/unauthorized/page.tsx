"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useHRMS } from '@/context/HRMSContext';

export default function UnauthorizedPage() {
  const { logout } = useHRMS();
  const router = useRouter();

  const handleLogoutAndRedirect = () => {
    logout();
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 relative select-none">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Unauthorized Card */}
      <div className="w-full max-w-md bg-[#131b2e] border-2 border-white/10 rounded-2xl p-8 shadow-2xl text-center relative animate-in zoom-in-95 duration-200">
        
        {/* Top of Box Title */}
        <div className="absolute -top-3.5 left-6 bg-[#090d16] px-4 py-0.5 border border-white/10 rounded-full text-xs font-semibold text-gray-400">
          Security Alert
        </div>

        {/* Security Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-rose-500/10 border border-rose-500/35 rounded-full text-rose-500 animate-pulse">
            <ShieldAlert className="h-12 w-12" />
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-white mb-2 uppercase tracking-wide">
          Access Restricted
        </h2>
        <p className="text-gray-400 text-xs leading-relaxed mb-8">
          You do not have the credentials required to view this corporate resource. Please contact your system administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3.5">
          <Link
            href="/"
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={handleLogoutAndRedirect}
            className="w-full bg-[#0b0f19] hover:bg-[#0f172a] border border-white/10 text-gray-400 hover:text-white font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign In with Different ID</span>
          </button>
        </div>
      </div>
    </div>
  );
}
