"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHRMS } from '../../context/HRMSContext';
import Navbar from '../../components/Navbar';
import { 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  CalendarDays,
  User,
  Coffee
} from 'lucide-react';

export default function AttendancePage() {
  const { currentUser, employees } = useHRMS();
  const router = useRouter();
  const [filterEmployeeId, setFilterEmployeeId] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const isAdminOrHR = currentUser.role === 'ADMIN' || currentUser.role === 'HR_OFFICER';

  // Gather attendance log rows
  // Each row will contain: Employee ID, Employee Name, Date, Check-In, Check-Out, Total Hours, Status
  interface FlatAttendanceRow {
    employeeId: string;
    employeeName: string;
    avatarUrl: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    totalHours?: number;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  }

  const allRows: FlatAttendanceRow[] = [];

  // Generate logs from all employees if Admin/HR, else only from current user
  const targetEmployees = isAdminOrHR ? employees : [currentUser];

  targetEmployees.forEach((emp) => {
    emp.attendanceHistory.forEach((att) => {
      allRows.push({
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        avatarUrl: emp.avatarUrl,
        date: att.date,
        checkInTime: att.checkInTime,
        checkOutTime: att.checkOutTime,
        totalHours: att.totalHours,
        status: att.status
      });
    });
  });

  // Sort rows by date desc
  allRows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply filters
  const filteredRows = allRows.filter((row) => {
    const matchesEmp = filterEmployeeId === 'ALL' || row.employeeId === filterEmployeeId;
    const matchesStatus = filterStatus === 'ALL' || row.status === filterStatus;
    return matchesEmp && matchesStatus;
  });

  // Calculate high-level stats for display
  const totalDays = allRows.length;
  const presentDays = allRows.filter(r => r.status === 'PRESENT' || r.status === 'HALF_DAY').length;
  const halfDays = allRows.filter(r => r.status === 'HALF_DAY').length;
  const leaveDays = allRows.filter(r => r.status === 'LEAVE').length;
  
  const avgHours = allRows.length > 0 
    ? (allRows.reduce((sum, r) => sum + (r.totalHours || 0), 0) / allRows.filter(r => r.totalHours !== undefined).length || 0).toFixed(1)
    : '0.0';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Present</span>;
      case 'ABSENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Absent</span>;
      case 'HALF_DAY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Half Day</span>;
      case 'LEAVE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Leave</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Attendance Logs</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isAdminOrHR 
                ? "Monitor corporate punch-ins, clock logs, and total logged hours." 
                : "Inspect your historical check-in timestamps and hour logs."}
            </p>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Logged Entries</span>
              <strong className="text-3xl font-extrabold text-white mt-1 block">{totalDays}</strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Active Full Days</span>
              <strong className="text-3xl font-extrabold text-emerald-400 mt-1 block">{presentDays - halfDays}</strong>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Average Shift Hours</span>
              <strong className="text-3xl font-extrabold text-indigo-300 mt-1 block">{avgHours} Hrs</strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Leave Shift Adjusts</span>
              <strong className="text-3xl font-extrabold text-amber-400 mt-1 block">{leaveDays + halfDays}</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Coffee className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* Filter Controls (Shown always, but Employee filters are limited) */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300 font-bold">
            <Filter className="h-4 w-4 text-indigo-400" />
            <span>Filter Punch History</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Employee Selector (Admins Only) */}
            {isAdminOrHR && (
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Employee:</span>
                <select
                  value={filterEmployeeId}
                  onChange={(e) => setFilterEmployeeId(e.target.value)}
                  className="bg-[#0f172a]/60 border border-white/[0.08] text-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-indigo-500 outline-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="ALL">All Staff</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-[#131b2e]">
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Selector */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#0f172a]/60 border border-white/[0.08] text-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-indigo-500 outline-none cursor-pointer w-full sm:w-auto"
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="LEAVE">Leave</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table Card */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-400" />
            <h2 className="font-bold text-white text-base">Punch Timeline Records</h2>
          </div>

          <div className="overflow-x-auto">
            {filteredRows.length > 0 ? (
              <table className="w-full text-left border-collapse text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {isAdminOrHR && <th className="px-6 py-4">Employee</th>}
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Total Hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      {isAdminOrHR && (
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img 
                            src={row.avatarUrl} 
                            alt={row.employeeName} 
                            className="h-7 w-7 rounded-full border border-white/10 object-cover"
                          />
                          <span className="font-semibold text-white">{row.employeeName}</span>
                        </td>
                      )}
                      <td className="px-6 py-4 font-medium text-gray-300">
                        {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {row.totalHours !== undefined ? `${row.totalHours.toFixed(2)} hrs` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(row.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <AlertTriangle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No attendance logs match the specified filters.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Dayflow HRMS System. Real-time portal sandbox.</p>
      </footer>
    </div>
  );
}
