"use client";

import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { MockEmployee } from '../../lib/mock-data';
import { 
  X, 
  User, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  ShieldAlert, 
  Lock, 
  FileText,
  CheckCircle,
  Inbox,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import SalaryForm from '../salary/SalaryForm';

interface ProfileViewProps {
  employee: MockEmployee;
  onClose: () => void;
}

export default function ProfileView({ employee, onClose }: ProfileViewProps) {
  const { currentUser, updatePassword, handleTimeOffApproval } = useHRMS();
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'timeoff' | 'security'>('resume');
  
  // Security Tab States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secError, setSecError] = useState('');
  const [secSuccess, setSecSuccess] = useState('');

  // Local state edit mode for admins editing another employee's salary
  const [isEditingSalary, setIsEditingSalary] = useState(false);

  if (!currentUser) return null;

  // Access control checks
  const isOwnProfile = currentUser.id === employee.id;

  // Private Info check: ADMIN, HR_OFFICER viewing an EMPLOYEE, or viewing own profile
  const canViewPrivateInfo = 
    currentUser.role === 'ADMIN' || 
    (currentUser.role === 'HR_OFFICER' && employee.role === 'EMPLOYEE') || 
    isOwnProfile;

  // Salary Info check: ADMIN only
  const canViewSalaryInfo = currentUser.role === 'ADMIN';

  // Time-Off Approval check: ADMIN, or HR_OFFICER approving an EMPLOYEE
  const canApproveTimeOff = 
    currentUser.role === 'ADMIN' || 
    (currentUser.role === 'HR_OFFICER' && employee.role === 'EMPLOYEE');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');

    if (newPassword !== confirmPassword) {
      setSecError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setSecError('Password must be at least 8 characters long');
      return;
    }

    const success = updatePassword(employee.id, newPassword);
    if (success) {
      setSecSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecError('Failed to update password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d16]/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Outer Click dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#131b2e] border border-white/10 shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Block */}
        <div className="relative px-6 py-8 bg-gradient-to-r from-indigo-950/40 via-indigo-900/20 to-transparent border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 select-none">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <img 
              src={employee.avatarUrl} 
              alt={`${employee.firstName} ${employee.lastName}`} 
              className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{employee.firstName} {employee.lastName}</h1>
                <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 border border-white/5 rounded">
                  {employee.employeeId}
                </span>
              </div>
              <p className="text-indigo-400 font-semibold text-sm mt-0.5">{employee.jobTitle}</p>
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                <Briefcase className="h-3 w-3 text-gray-500" />
                {employee.department} • Joined {new Date(employee.dateOfJoining).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              employee.presence 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              <span className={`h-2 w-2 rounded-full ${employee.presence ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              {employee.presence ? 'Checked In' : 'Checked Out'}
            </span>
            <span className="text-xs text-gray-400 font-medium">Role: <strong className="text-gray-300 font-semibold">{employee.role.replace('_', ' ')}</strong></span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 px-6 overflow-x-auto bg-[#0f172a]/20 select-none">
          <button 
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'resume' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Resume / Overview
          </button>

          {/* Private Info Tab - Guarded */}
          {canViewPrivateInfo && (
            <button 
              onClick={() => setActiveTab('private')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'private' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Private Info
            </button>
          )}

          {/* Salary Info Tab - Guarded */}
          {canViewSalaryInfo && (
            <button 
              onClick={() => setActiveTab('salary')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'salary' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Salary Info
            </button>
          )}

          {/* Time-Off Tab */}
          <button 
            onClick={() => setActiveTab('timeoff')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'timeoff' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Time-Off History
          </button>

          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'security' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Security
            </button>
          )}
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 flex-1 min-h-[350px]">
          
          {/* Tab 1: Resume / Overview */}
          {activeTab === 'resume' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
              
              {/* Left Column: Contact and About */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About Me</h3>
                  <p className="text-gray-300 text-sm leading-relaxed bg-[#0f172a]/20 p-4 rounded-xl border border-white/5">
                    {employee.aboutMe || "No summary provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Skills & Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.length > 0 ? (
                      employee.skills.map((skill, i) => (
                        <span key={i} className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No skills registered.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.certifications.length > 0 ? (
                      employee.certifications.map((cert, i) => (
                        <span key={i} className="text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-lg">
                          {cert}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No certifications registered.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Metadata Panel */}
              <div className="space-y-4 bg-[#0f172a]/30 border border-white/5 p-4 rounded-xl h-fit">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Contact Cards</h3>
                
                <div className="space-y-3.5 text-sm text-gray-300">
                  <div className="flex items-start gap-2.5">
                    <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Work Email</span>
                      <a href={`mailto:${employee.email}`} className="text-indigo-300 hover:underline break-all">{employee.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Phone Line</span>
                      <span>{employee.phone || "Not set"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Postal Address</span>
                      <span className="text-xs">{employee.address || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Private Info - Guarded */}
          {activeTab === 'private' && canViewPrivateInfo && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Section A: Bank Details */}
                <div className="bg-[#0f172a]/30 border border-white/5 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <CreditCard className="h-4 w-4 text-indigo-400" />
                    <h3 className="font-bold text-sm text-gray-300 uppercase tracking-wider">Bank Details</h3>
                  </div>

                  {employee.bankDetails ? (
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Bank Name</span>
                        <span className="font-semibold">{employee.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Account Number</span>
                        <span className="font-semibold">{employee.bankDetails.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Routing Number</span>
                        <span className="font-semibold">{employee.bankDetails.routingNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Account Holder</span>
                        <span className="font-semibold">{employee.bankDetails.accountHolderName}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No bank credentials configured.</p>
                  )}
                </div>

                {/* Section B: Personal IDs & Emergency Contacts */}
                <div className="bg-[#0f172a]/30 border border-white/5 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <User className="h-4 w-4 text-indigo-400" />
                    <h3 className="font-bold text-sm text-gray-300 uppercase tracking-wider">Governance Details</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">National ID</span>
                      <span className="font-semibold">{employee.nationalId || "Not set"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Emergency Contact</span>
                      <span className="font-semibold">Jane Smith (Mother)</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Joining Date</span>
                      <span className="font-semibold">{employee.dateOfJoining}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Emergency Phone</span>
                      <span className="font-semibold">+1 (555) 999-8888</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 3: Salary Info - Guarded */}
          {activeTab === 'salary' && canViewSalaryInfo && (
            <div className="animate-in fade-in duration-200">
              <div className="space-y-6">
                {isEditingSalary ? (
                  // Rendering Editor Form
                  <div className="bg-[#0f172a]/30 border border-white/5 p-6 rounded-2xl relative">
                    <button 
                      onClick={() => setIsEditingSalary(false)}
                      className="absolute top-4 right-4 text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <SalaryForm 
                      employee={employee} 
                      onSuccess={() => setIsEditingSalary(false)} 
                    />
                  </div>
                ) : (
                  // Displaying current structure stats
                  <div className="bg-[#0f172a]/30 border border-white/5 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-bold text-white text-base">Active Compensation Package</h3>
                      </div>
                      <button 
                        onClick={() => setIsEditingSalary(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-4 rounded-lg text-xs transition-all"
                      >
                        Modify Structure
                      </button>
                    </div>

                    {employee.salaryStructure ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Monthly Wage</span>
                          <span className="text-3xl font-extrabold text-white mt-1">${employee.salaryStructure.monthlyWage.toLocaleString()}</span>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Yearly Wage</span>
                          <span className="text-3xl font-extrabold text-indigo-400 mt-1">${employee.salaryStructure.yearlyWage.toLocaleString()}</span>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Weekly Workdays</span>
                          <span className="text-3xl font-extrabold text-violet-400 mt-1">{employee.salaryStructure.workingDaysPerWeek} Days</span>
                        </div>

                        <div className="md:col-span-3 bg-[#0f172a]/40 p-4 rounded-xl space-y-3.5 text-sm text-gray-300">
                          <span className="text-xs font-bold text-indigo-400 uppercase block tracking-wider">Wage Component Breakdown</span>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-gray-500">Basic Wage (50%):</span>
                              <span className="font-semibold">${(employee.salaryStructure.monthlyWage * 0.5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-gray-500">HRA Allowance (20%):</span>
                              <span className="font-semibold">${(employee.salaryStructure.monthlyWage * 0.2).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-gray-500">Standard Allowance (8.33%):</span>
                              <span className="font-semibold">${(employee.salaryStructure.monthlyWage * 0.0833).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-gray-500">Performance Bonus (8.33%):</span>
                              <span className="font-semibold">${(employee.salaryStructure.monthlyWage * 0.0833).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-gray-500">Fixed Allowance (Remainder):</span>
                              <span className="font-semibold">${(employee.salaryStructure.fixedAllowance).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-gray-500">PF Deductions:</span>
                              <span className="font-semibold text-rose-400">-${employee.salaryStructure.pfDeduction.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Professional Tax:</span>
                              <span className="font-semibold text-rose-400">-${employee.salaryStructure.professionalTax.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No compensation package configured.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Time-Off History & Approval Center */}
          {activeTab === 'timeoff' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Balances panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0f172a]/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Paid Leave Balance</span>
                    <strong className="text-2xl font-extrabold text-white mt-1 block">{employee.timeOffBalances?.paid ?? 0} Days</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-[#0f172a]/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sick Leave Balance</span>
                    <strong className="text-2xl font-extrabold text-indigo-300 mt-1 block">{employee.timeOffBalances?.sick ?? 0} Days</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-[#0f172a]/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Unpaid Leave Requests</span>
                    <strong className="text-2xl font-extrabold text-amber-400 mt-1 block">Active Log</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Info className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Time-Off Approval Center (Guarded: visible only to Admin/HR, and not viewing own profile) */}
              {(!isOwnProfile && canApproveTimeOff) && (
                <div className="bg-[#0f172a]/30 border border-white/5 p-5 rounded-xl space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="font-bold text-sm text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Inbox className="h-4 w-4 text-indigo-400" />
                      Time-Off Approval Center
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Manage and review pending requests for this employee.</p>
                  </div>
                  {employee.timeOffRequests?.filter(r => r.status === 'PENDING').length > 0 ? (
                    <div className="space-y-3">
                      {employee.timeOffRequests.filter(r => r.status === 'PENDING').map((req) => (
                        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-white/5 rounded-lg border border-white/5">
                          <div>
                            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-1.5 py-0.5 rounded mr-2">
                              {req.type}
                            </span>
                            <span className="text-sm font-semibold text-white">{req.startDate} to {req.endDate}</span>
                            {req.remarks && <p className="text-xs text-gray-400 mt-1.5 italic">"{req.remarks}"</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTimeOffApproval(employee.id, req.id, 'APPROVED')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleTimeOffApproval(employee.id, req.id, 'REJECTED')}
                              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">All caught up! No pending leave applications for this employee.</p>
                  )}
                </div>
              )}

              {/* Leave Requests Log */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-300 uppercase tracking-wider">Leave Request Log</h3>
                {employee.timeOffRequests && employee.timeOffRequests.length > 0 ? (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {employee.timeOffRequests.map((req) => (
                      <div key={req.id} className="flex justify-between items-center p-3 bg-[#0f172a]/20 border border-white/5 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{req.type}</span>
                            <span className="text-xs text-gray-300 font-semibold">{req.startDate} to {req.endDate}</span>
                          </div>
                          {req.remarks && <p className="text-[11px] text-gray-500 mt-1 italic">"{req.remarks}"</p>}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No leave history found.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Security */}
          {activeTab === 'security' && isOwnProfile && (
            <div className="max-w-md mx-auto animate-in fade-in duration-200">
              
              <form onSubmit={handlePasswordChange} className="bg-[#0f172a]/30 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Lock className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-gray-300 uppercase tracking-wider">Update Account Security</h3>
                </div>

                {secError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-lg text-xs font-semibold">
                    {secError}
                  </div>
                )}
                {secSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {secSuccess}
                  </div>
                )}

                <div className="form-group">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Current Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">New Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm transition-all"
                >
                  Save Password
                </button>
              </form>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
