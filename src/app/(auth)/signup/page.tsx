"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHRMS } from '@/context/HRMSContext';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { 
  Activity, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Briefcase, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

export default function SignUpPage() {
  const { registerCompany, currentUser } = useHRMS();
  const router = useRouter();
  
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for mock logo upload
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [logoName, setLogoName] = useState('');
  
  // State for submission & modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registeredEmployee, setRegisteredEmployee] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUploaded(true);
      setLogoName(file.name);
    }
  };

  const onSubmit = async (data: RegisterInput) => {
    setApiError(null);
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Call register company context helper
      const adminEmployee = registerCompany(
        data.companyName,
        data.name,
        data.email,
        data.phone,
        data.password
      );

      if (adminEmployee) {
        setRegisteredEmployee(adminEmployee);
      } else {
        setApiError('An error occurred while creating your account.');
      }
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred during company registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleProceed = () => {
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 py-12 relative select-none">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-10">
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

        {/* Form Error Banner */}
        {apiError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-start gap-2 mb-6 animate-in fade-in duration-200">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Field: Company Name + Upload */}
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
                  disabled={isSubmitting}
                  {...register('companyName')}
                  className={`w-full bg-[#0f172a]/60 border text-white rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-all ${
                    errors.companyName ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500'
                  }`}
                  placeholder="e.g. Odoo India"
                />
              </div>

              {/* Upload Logo button */}
              <div className="relative shrink-0">
                <input 
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  onChange={handleLogoUploadChange}
                />
                <button 
                  type="button"
                  title="Upload Company Logo"
                  className={`px-3 py-2 rounded-lg text-white border text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    logoUploaded 
                      ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-xs font-semibold hidden sm:inline">{logoUploaded ? "Uploaded" : "Upload Logo"}</span>
                </button>
              </div>
            </div>
            {errors.companyName && (
              <span className="text-rose-400 text-[11px] font-semibold block">
                {errors.companyName.message}
              </span>
            )}
            {logoUploaded && (
              <span className="block text-[10px] text-emerald-400 italic">File: {logoName}</span>
            )}
          </div>

          {/* Field: Full Name */}
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
                disabled={isSubmitting}
                {...register('name')}
                className={`w-full bg-[#0f172a]/60 border text-white rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-all ${
                  errors.name ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500'
                }`}
                placeholder="e.g. Mohammad Sameer"
              />
            </div>
            {errors.name && (
              <span className="text-rose-400 text-[11px] font-semibold block">
                {errors.name.message}
              </span>
            )}
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
                disabled={isSubmitting}
                {...register('email')}
                className={`w-full bg-[#0f172a]/60 border text-white rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-all ${
                  errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500'
                }`}
                placeholder="m.sameer@company.com"
              />
            </div>
            {errors.email && (
              <span className="text-rose-400 text-[11px] font-semibold block">
                {errors.email.message}
              </span>
            )}
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
                disabled={isSubmitting}
                {...register('phone')}
                className={`w-full bg-[#0f172a]/60 border text-white rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-all ${
                  errors.phone ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500'
                }`}
                placeholder="+1 (555) 019-2834"
              />
            </div>
            {errors.phone && (
              <span className="text-rose-400 text-[11px] font-semibold block">
                {errors.phone.message}
              </span>
            )}
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
                type={showPassword ? 'text' : 'password'} 
                disabled={isSubmitting}
                {...register('password')}
                className={`w-full bg-[#0f172a]/60 border text-white rounded-lg pl-9 pr-10 py-2 text-sm outline-none transition-all ${
                  errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500'
                }`}
                placeholder="Min 8 characters"
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
              <span className="text-rose-400 text-[11px] font-semibold block">
                {errors.password.message}
              </span>
            )}
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
                type={showConfirmPassword ? 'text' : 'password'} 
                disabled={isSubmitting}
                {...register('confirmPassword')}
                className={`w-full bg-[#0f172a]/60 border text-white rounded-lg pl-9 pr-10 py-2 text-sm outline-none transition-all ${
                  errors.confirmPassword ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500'
                }`}
                placeholder="Re-enter password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-400 text-[11px] font-semibold block">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Purple Button: Sign Up */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-700 hover:bg-purple-600 active:bg-purple-800 disabled:bg-purple-800/50 text-white font-bold text-sm tracking-wide py-2.5 rounded-lg transition-all shadow-lg mt-6 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>SIGNING UP...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <span>Already have an account? </span>
          <Link href="/signin" className="text-purple-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>

      {/* Success Modal showing generated Login ID */}
      {registeredEmployee && (
        <div className="fixed inset-0 z-50 bg-[#090d16]/80 backdrop-blur-md flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#131b2e] border-2 border-white/10 rounded-2xl p-8 shadow-2xl text-center relative select-none animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Company Registered Successfully!</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Your Dayflow HRMS admin profile has been generated. Use the auto-generated Login ID below to sign in.
            </p>

            {/* Generated Login ID Display Box */}
            <div className="bg-[#0b0f19] border border-white/5 rounded-xl p-4 mb-6 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">
                Your Auto-Generated Login ID
              </span>
              <div className="flex items-center gap-2 bg-[#0f172a]/60 px-4 py-2.5 rounded-lg border border-white/10 w-full max-w-xs justify-between">
                <span className="font-mono text-base font-bold text-indigo-400 tracking-wider">
                  {registeredEmployee.employeeId}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(registeredEmployee.employeeId)}
                  className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 active:scale-95 transition-all"
                  title="Copy Login ID"
                >
                  {copiedId ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              {copiedId && (
                <span className="text-emerald-400 text-[10px] font-semibold mt-1">Copied to clipboard!</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white font-bold py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-900/25"
            >
              Proceed to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
