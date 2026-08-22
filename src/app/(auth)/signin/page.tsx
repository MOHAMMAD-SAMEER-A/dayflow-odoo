"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHRMS } from '@/context/HRMSContext';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { Activity, Lock, Mail, ShieldAlert, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const { login, currentUser } = useHRMS();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setApiError(null);
    setIsSubmitting(true);

    // Simulate small delay for loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const success = login(data.emailOrId, data.password);
      if (success) {
        router.push('/');
      } else {
        setApiError('Invalid credentials. Note: Use any mock email (e.g. m.sameer@odoo.com) or Employee ID (e.g. ODMASA20240001) and any password.');
      }
    } catch (err) {
      setApiError('An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 relative select-none">
      {/* Hand-drawn style background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-normal text-[#e2e8f0] tracking-widest font-mono">
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

        {/* Form Error Banner */}
        {apiError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-start gap-2 mb-6 animate-in fade-in duration-200">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register('emailOrId')}
                disabled={isSubmitting}
                className={`w-full bg-[#0f172a]/60 border-2 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all font-mono ${
                  errors.emailOrId ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-indigo-500'
                }`}
                placeholder="e.g. m.sameer@odoo.com"
              />
            </div>
            {errors.emailOrId && (
              <span className="text-rose-400 text-xs font-semibold block mt-1">
                {errors.emailOrId.message}
              </span>
            )}
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
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                disabled={isSubmitting}
                className={`w-full bg-[#0f172a]/60 border-2 text-white rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none transition-all font-mono ${
                  errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-indigo-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-rose-400 text-xs font-semibold block mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Purple Button: SIGN IN */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-700 hover:bg-purple-600 active:bg-purple-800 disabled:bg-purple-800/50 text-white font-bold tracking-widest text-sm uppercase py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </form>

        {/* Footer text link */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <span>Don't have an Account? </span>
          <Link href="/signup" className="text-purple-400 hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
