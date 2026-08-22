"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHRMS } from '../context/HRMSContext';
import { MockEmployee } from '../lib/mock-data';
import Navbar from '../components/Navbar';
import ProfileView from '../components/profile/ProfileView';
import { 
  Search, 
  Filter, 
  Briefcase, 
  UserCheck, 
  Users, 
  Clock, 
  Plus, 
  LayoutGrid,
  ChevronRight,
  UserPlus,
  X,
  Lock,
  Copy,
  CheckCircle2,
  DollarSign,
  Key,
  Activity,
  Upload,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';

export default function DirectoryPage() {
  const { employees, currentUser, login, registerCompany, addEmployeeByAdmin } = useHRMS();
  const router = useRouter();

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/signin');
    }
  }, [currentUser, router]);

  // Authentication View State
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form States
  const [signInEmailOrId, setSignInEmailOrId] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // Sign Up Form States
  const [signUpCompanyName, setSignUpCompanyName] = useState('');
  const [signUpAdminName, setSignUpAdminName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [signUpError, setSignUpError] = useState('');

  // Dashboard / Modal States
  const [selectedEmployee, setSelectedEmployee] = useState<MockEmployee | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Add Employee Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'HR_OFFICER' | 'ADMIN'>('EMPLOYEE');
  const [monthlyWage, setMonthlyWage] = useState(5000);

  // Success credentials screen state
  const [createdDetails, setCreatedDetails] = useState<{ id: string; tempPass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const [formError, setFormError] = useState('');

  // Handlers for Authentication
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInEmailOrId || !signInPassword) {
      setSignInError('Please fill in all fields.');
      return;
    }

    const success = login(signInEmailOrId, signInPassword);
    if (!success) {
      setSignInError('Invalid credentials. Tip: Use m.sameer@odoo.com or ODMASA20240001.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpCompanyName || !signUpAdminName || !signUpEmail || !signUpPhone || !signUpPassword || !signUpConfirmPassword) {
      setSignUpError('Please fill in all fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    if (signUpPassword.length < 8) {
      setSignUpError('Password must be at least 8 characters long.');
      return;
    }

    try {
      registerCompany(signUpCompanyName, signUpAdminName, signUpEmail, signUpPhone, signUpPassword);
    } catch (err) {
      setSignUpError('An error occurred during registration.');
    }
  };

  // Directory Stats
  const totalCount = employees.length;
  const presentCount = employees.filter(e => e.presence).length;
  const absentCount = totalCount - presentCount;
  const presenceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Filters setup
  const departments = ['ALL', ...Array.from(new Set(employees.map(e => e.department)))];
  const roles = ['ALL', 'ADMIN', 'HR_OFFICER', 'EMPLOYEE'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesRole = selectedRole === 'ALL' || emp.role === selectedRole;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!firstName || !lastName || !email || !jobTitle || !department || !dateOfJoining) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const { employee, tempPass } = addEmployeeByAdmin({
        firstName,
        lastName,
        email,
        phone,
        address,
        jobTitle,
        department,
        dateOfJoining,
        nationalId,
        role,
        monthlyWage
      });

      setCreatedDetails({ id: employee.employeeId, tempPass });
      
      // Reset inputs
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setJobTitle('');
      setDepartment('');
      setDateOfJoining('');
      setNationalId('');
      setRole('EMPLOYEE');
      setMonthlyWage(5000);
    } catch (err) {
      setFormError('An error occurred while creating employee.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  // --- RENDER FLOWS ---

  // 1. Unauthenticated: Redirect to Sign In
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-semibold font-mono">Loading Dayflow HRMS...</span>
        </div>
      </div>
    );
  }

  // 2. Authenticated: Render Main Employee Directory
  const isAdmin = currentUser.role === 'ADMIN';
  const isAdminOrHR = currentUser.role === 'ADMIN' || currentUser.role === 'HR_OFFICER';

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Employee Directory</h1>
            <p className="text-gray-400 text-sm mt-1">Manage, search, and monitor corporate profiles and daily operations.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdminOrHR && (
              <button
                onClick={() => {
                  setCreatedDetails(null);
                  setAddModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-all shadow-lg active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                Add Employee
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Headcount</span>
              <strong className="text-3xl font-extrabold text-white mt-1 block">{totalCount}</strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Currently Present</span>
              <strong className="text-3xl font-extrabold text-emerald-400 mt-1 block">{presentCount}</strong>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Currently Absent</span>
              <strong className="text-3xl font-extrabold text-rose-400 mt-1 block">{absentCount}</strong>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Attendance Rate</span>
              <strong className="text-3xl font-extrabold text-indigo-300 mt-1 block">{presenceRate}%</strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              <LayoutGrid className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="text" 
              className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 outline-none font-mono"
              placeholder="Search by name, title, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Filter className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full sm:w-auto bg-[#0f172a]/60 border border-white/[0.08] text-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-indigo-500 outline-none cursor-pointer"
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept} className="bg-[#131b2e]">
                    {dept === 'ALL' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full sm:w-auto bg-[#0f172a]/60 border border-white/[0.08] text-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-indigo-500 outline-none cursor-pointer"
            >
              {roles.map((r, idx) => (
                <option key={idx} value={r} className="bg-[#131b2e]">
                  {r === 'ALL' ? 'All System Roles' : r.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div>
          {filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEmployees.map((emp) => (
                <div 
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="group relative cursor-pointer glass-panel hover:bg-[#131b2e]/90 hover:border-white/20 hover:shadow-indigo-500/5 hover:-translate-y-0.5 rounded-2xl p-5 transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <img 
                      src={emp.avatarUrl} 
                      alt={`${emp.firstName} ${emp.lastName}`} 
                      className="h-16 w-16 rounded-xl object-cover border border-white/10 group-hover:border-indigo-500/50 transition-colors"
                    />
                    <div className="flex items-center gap-1.5 bg-black/30 border border-white/5 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-gray-400">
                      <span className={`h-2.5 w-2.5 rounded-full ${emp.presence ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                      <span>{emp.presence ? 'PRESENT' : 'ABSENT'}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-extrabold text-base leading-snug group-hover:text-indigo-400 transition-colors">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-indigo-300 text-xs font-semibold mt-0.5">{emp.jobTitle}</p>
                    <p className="text-gray-500 text-[10px] tracking-wide font-medium mt-1.5 uppercase">{emp.department}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 mt-4 pt-3.5 text-xs text-gray-500">
                    <span className="font-mono tracking-wide bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-[10px] text-gray-400">
                      {emp.employeeId}
                    </span>
                    <span className="text-indigo-500 group-hover:translate-x-0.5 transition-transform flex items-center font-bold">
                      View Profile
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-gray-500 text-sm">No employee profiles match the specified filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Profile Detail View Modal */}
      {selectedEmployee && (
        <ProfileView 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}

      {/* Add Employee Modal (Admin Specs) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d16]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setAddModalOpen(false)} />

          <div className="relative w-full max-w-lg rounded-2xl bg-[#131b2e] border border-white/10 p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>

            {!createdDetails ? (
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-extrabold text-white text-base">Add New Employee</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Auto-generates employee ID and temporary password.</p>
                </div>

                {formError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-lg text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">First Name *</label>
                    <input 
                      type="text" required
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John"
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Last Name *</label>
                    <input 
                      type="text" required
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Doe"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address *</label>
                  <input 
                    type="email" required
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Phone Number</label>
                    <input 
                      type="text"
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">National ID</label>
                    <input 
                      type="text"
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={nationalId} onChange={(e) => setNationalId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Address</label>
                  <input 
                    type="text"
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                    value={address} onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Job Title *</label>
                    <input 
                      type="text" required
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. QA Automation"
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Department *</label>
                    <input 
                      type="text" required
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                      value={department} onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Engineering"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Joining Date *</label>
                    <input 
                      type="date" required
                      className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none cursor-pointer"
                      value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Monthly Wage ($) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <DollarSign className="h-3 w-3 text-gray-500" />
                      </div>
                      <input 
                        type="number" required
                        className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-7 pr-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                        value={monthlyWage} onChange={(e) => setMonthlyWage(Math.max(0, parseInt(e.target.value) || 0))}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">System Permissions Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none"
                  >
                    <option value="EMPLOYEE">Regular Employee (Role restrictions active)</option>
                    <option value="HR_OFFICER">HR Officer (Can view & approve leave, view salary)</option>
                    <option value="ADMIN">System Admin (Full unrestricted access)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm transition-all"
                >
                  Create Employee
                </button>
              </form>
            ) : (
              <div className="space-y-6 py-4 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-3" />
                  <h3 className="text-xl font-extrabold text-white">Employee Created Successfully</h3>
                  <p className="text-xs text-gray-400 mt-1">Credentials have been generated according to system format.</p>
                </div>

                <div className="bg-[#0b0f19] border border-white/5 rounded-xl p-4 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Generated Login Employee ID</span>
                    <div className="flex items-center justify-between bg-[#131b2e] border border-white/5 px-3.5 py-2 rounded-lg font-mono text-sm text-indigo-400 select-all font-bold tracking-wider">
                      <span>{createdDetails.id}</span>
                      <button 
                        onClick={() => copyToClipboard(createdDetails.id)}
                        className="text-gray-400 hover:text-white p-1"
                        title="Copy Employee ID"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Auto-Generated Temporary Password</span>
                    <div className="flex items-center justify-between bg-[#131b2e] border border-white/5 px-3.5 py-2 rounded-lg font-mono text-sm text-white select-all font-bold">
                      <span className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-gray-500" />
                        {createdDetails.tempPass}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(createdDetails.tempPass)}
                        className="text-gray-400 hover:text-white p-1"
                        title="Copy Password"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-xs text-amber-400 leading-relaxed flex gap-2">
                  <Lock className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                  <span>
                    <strong>Note:</strong> Employees can sign in using this temporary password and their email. Upon login, they can update their password under their personal profile's <strong>Security tab</strong>.
                  </span>
                </div>

                {copiedPass && (
                  <div className="text-center text-xs font-semibold text-emerald-400 animate-pulse">
                    Copied to clipboard!
                  </div>
                )}

                <button
                  onClick={() => setAddModalOpen(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-white/[0.08] mt-12 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Dayflow HRMS System. Real-time portal sandbox.</p>
      </footer>
    </div>
  );
}
