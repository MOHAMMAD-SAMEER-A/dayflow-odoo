"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHRMS } from '../context/HRMSContext';
import { 
  Clock, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  User as UserIcon, 
  Users, 
  Calendar, 
  Activity,
  AlertCircle
} from 'lucide-react';
import ProfileView from './profile/ProfileView';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, employees, switchUser, toggleCheckIn, logout } = useHRMS();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  if (!currentUser) return null;

  const activeLinkClass = "text-indigo-400 bg-white/5 border border-white/5 shadow-sm";
  const inactiveLinkClass = "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent";

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0b0f19]/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo & Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                <Activity className="h-6 w-6 text-indigo-400" />
                <span>Dayflow</span>
              </Link>
              
              <nav className="hidden md:flex space-x-1">
                <Link 
                  href="/" 
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${pathname === '/' ? activeLinkClass : inactiveLinkClass}`}
                >
                  <Users className="h-4 w-4" />
                  Employees
                </Link>
                <Link 
                  href="/attendance" 
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${pathname === '/attendance' ? activeLinkClass : inactiveLinkClass}`}
                >
                  <Clock className="h-4 w-4" />
                  Attendance
                </Link>
                <Link 
                  href="/time-off" 
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${pathname === '/time-off' ? activeLinkClass : inactiveLinkClass}`}
                >
                  <Calendar className="h-4 w-4" />
                  Time Off
                </Link>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              
              {/* Check-In / Check-Out Button */}
              <button 
                onClick={toggleCheckIn}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                  currentUser.presence 
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {currentUser.presence ? (
                  <>
                    <LogOut className="h-4 w-4 animate-pulse" />
                    <span>Check Out</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Check In</span>
                  </>
                )}
              </button>

              {/* Persona Selector Widget */}
              <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/5 rounded-lg px-2 py-1">
                <span className="text-[10px] uppercase font-bold text-gray-500 px-1">Role Switcher:</span>
                <select 
                  value={currentUser.id} 
                  onChange={(e) => switchUser(e.target.value)}
                  className="bg-transparent text-xs text-gray-300 outline-none border-none cursor-pointer pr-4 font-semibold hover:text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-[#0b0f19] text-gray-200">
                      {emp.firstName} ({emp.role === 'ADMIN' ? 'Admin' : emp.role === 'HR_OFFICER' ? 'HR' : 'Emp'})
                    </option>
                  ))}
                </select>
              </div>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none p-1 rounded-lg hover:bg-white/5 transition-all"
                >
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="h-8 w-8 rounded-full border border-white/20 object-cover" 
                  />
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </button>

                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#131b2e] border border-white/10 shadow-2xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-semibold text-white leading-tight">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {currentUser.email}
                        </p>
                        <span className="inline-block text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded mt-1.5">
                          {currentUser.role.replace('_', ' ')}
                        </span>
                      </div>

                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        My Profile
                      </button>

                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-white/5"
                      >
                        <LogOut className="h-4 w-4 text-rose-400" />
                        Sign Out
                      </button>

                      {/* Selector inside dropdown for mobile/narrow screens */}
                      <div className="sm:hidden border-t border-white/5 py-1 px-4">
                        <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Swap Mock User</label>
                        <select 
                          value={currentUser.id} 
                          onChange={(e) => {
                            switchUser(e.target.value);
                            setDropdownOpen(false);
                          }}
                          className="w-full bg-[#0b0f19] border border-white/10 rounded px-2 py-1 text-xs text-gray-300 outline-none"
                        >
                          {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.firstName} {emp.lastName} ({emp.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* User profile view modal */}
      {profileModalOpen && (
        <ProfileView 
          employee={currentUser} 
          onClose={() => setProfileModalOpen(false)} 
        />
      )}
    </>
  );
}
