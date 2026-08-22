"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHRMS } from '../../context/HRMSContext';
import Navbar from '../../components/Navbar';
import { 
  Calendar, 
  FileText, 
  Check, 
  X, 
  Plus, 
  Clock, 
  AlertCircle,
  FileUp,
  Inbox,
  Sparkles,
  Info
} from 'lucide-react';
import { TimeOffStatus } from '../../types/hrms';

// Working days helper
function getWorkingDaysCount(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function TimeOffPage() {
  const { currentUser, employees, applyForLeave, handleTimeOffApproval } = useHRMS();
  const router = useRouter();
  
  // Modals / forms state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'PAID' | 'SICK' | 'UNPAID'>('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [formError, setFormError] = useState('');

  // Admin comments state map (key: requestId)
  const [adminComments, setAdminComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const isAdminOrHR = currentUser.role === 'ADMIN' || currentUser.role === 'HR_OFFICER';

  // Handle leave application
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }

    const days = getWorkingDaysCount(startDate, endDate);
    if (days === 0) {
      setFormError('Leave duration must include at least one working day (Monday - Friday).');
      return;
    }

    // Check balance for Paid/Sick
    if (leaveType === 'PAID' && days > currentUser.timeOffBalances.paid) {
      setFormError(`Insufficient Paid Leave balance. Requested: ${days} days, Available: ${currentUser.timeOffBalances.paid} days.`);
      return;
    }
    if (leaveType === 'SICK' && days > currentUser.timeOffBalances.sick) {
      setFormError(`Insufficient Sick Leave balance. Requested: ${days} days, Available: ${currentUser.timeOffBalances.sick} days.`);
      return;
    }

    applyForLeave({
      type: leaveType,
      startDate,
      endDate,
      remarks,
      attachmentUrl: attachmentName ? `/mock-uploads/${attachmentName}` : undefined
    });

    // Reset and close
    setStartDate('');
    setEndDate('');
    setRemarks('');
    setAttachmentName('');
    setApplyModalOpen(false);
  };

  // Compile all pending requests for Admin Hub
  interface FlatRequestRow {
    employeeId: string;
    employeeName: string;
    avatarUrl: string;
    requestId: string;
    type: 'PAID' | 'SICK' | 'UNPAID';
    startDate: string;
    endDate: string;
    remarks?: string;
    attachmentUrl?: string;
    status: TimeOffStatus;
    adminComment?: string;
  }

  const pendingRequests: FlatRequestRow[] = [];
  const allHistoricalRequests: FlatRequestRow[] = [];

  employees.forEach((emp) => {
    emp.timeOffRequests.forEach((req) => {
      const row: FlatRequestRow = {
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        avatarUrl: emp.avatarUrl,
        requestId: req.id,
        type: req.type,
        startDate: req.startDate,
        endDate: req.endDate,
        remarks: req.remarks || undefined,
        attachmentUrl: req.attachmentUrl || undefined,
        status: req.status,
        adminComment: req.adminComment || undefined
      };

      if (req.status === 'PENDING') {
        pendingRequests.push(row);
      } else {
        allHistoricalRequests.push(row);
      }
    });
  });

  // Sort historical requests by start date desc
  allHistoricalRequests.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const getStatusBadge = (status: TimeOffStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Leave Management</h1>
            <p className="text-gray-400 text-sm mt-1">Submit time-off requests, view balances, and process team applications.</p>
          </div>

          <button
            onClick={() => setApplyModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            Apply for Leave
          </button>
        </div>

        {/* User Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Paid Time Off (PTO)</span>
              <strong className="text-3xl font-extrabold text-white mt-1 block">{currentUser.timeOffBalances.paid} Days</strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sick Leave Balance</span>
              <strong className="text-3xl font-extrabold text-indigo-300 mt-1 block">{currentUser.timeOffBalances.sick} Days</strong>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Unpaid / Adjust Shifts</span>
              <strong className="text-3xl font-extrabold text-amber-400 mt-1 block">Active Tracker</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Info className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* Admin Approval Hub (Admins/HR only) */}
        {isAdminOrHR && (
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                <Inbox className="h-5 w-5 text-indigo-400" />
                Admin Approval Hub
                {pendingRequests.length > 0 && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
                    {pendingRequests.length} pending
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Review and approve or reject employee time-off requests.</p>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="space-y-4 divide-y divide-white/5">
                {pendingRequests.map((req, idx) => {
                  const days = getWorkingDaysCount(req.startDate, req.endDate);
                  return (
                    <div key={req.requestId} className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${idx > 0 ? 'pt-4' : ''}`}>
                      <div className="flex items-start gap-3">
                        <img 
                          src={req.avatarUrl} 
                          alt={req.employeeName} 
                          className="h-10 w-10 rounded-full border border-white/10 object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{req.employeeName}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400">
                            <span className="font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                              {req.type}
                            </span>
                            <span>•</span>
                            <span className="text-gray-300 font-semibold">{req.startDate} to {req.endDate}</span>
                            <span className="text-gray-500">({days} working days)</span>
                          </div>
                          {req.remarks && (
                            <p className="text-xs text-gray-300 bg-[#0f172a]/40 p-2.5 rounded-lg border border-white/5 mt-2.5 max-w-xl italic">
                              "{req.remarks}"
                            </p>
                          )}
                          {req.attachmentUrl && (
                            <div className="mt-2 text-xs flex items-center gap-1.5 text-indigo-400">
                              <FileText className="h-3.5 w-3.5" />
                              <span className="cursor-pointer hover:underline">Mock Certificate (Download)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        <input 
                          type="text" 
                          placeholder="Add comments..."
                          className="bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500 max-w-xs w-full"
                          value={adminComments[req.requestId] || ''}
                          onChange={(e) => setAdminComments({
                            ...adminComments,
                            [req.requestId]: e.target.value
                          })}
                        />
                        
                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={() => handleTimeOffApproval(req.employeeId, req.requestId, 'APPROVED', adminComments[req.requestId])}
                            className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button 
                            onClick={() => handleTimeOffApproval(req.employeeId, req.requestId, 'REJECTED', adminComments[req.requestId])}
                            className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-500 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#0f172a]/20 border border-dashed border-white/5 rounded-xl">
                <p className="text-xs text-gray-500">All caught up! No pending leave applications.</p>
              </div>
            )}
          </div>
        )}

        {/* History of Requests */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h2 className="font-bold text-white text-base">
              {isAdminOrHR ? "All Corporate Leave Log History" : "My Leave Request History"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {/* Show employees' own requests, or all historical logs if admin */}
            {(isAdminOrHR ? allHistoricalRequests : currentUser.timeOffRequests).length > 0 ? (
              <table className="w-full text-left border-collapse text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {isAdminOrHR && <th className="px-6 py-4">Employee</th>}
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Working Days</th>
                    <th className="px-6 py-4">Reason / Remarks</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Review Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(isAdminOrHR ? allHistoricalRequests : currentUser.timeOffRequests).map((row, idx) => {
                    const days = getWorkingDaysCount(row.startDate, row.endDate);
                    // Renders employee's request object directly or database row
                    const isRowObject = 'requestId' in row;
                    const empName = isRowObject ? (row as FlatRequestRow).employeeName : `${currentUser.firstName} ${currentUser.lastName}`;
                    const avatar = isRowObject ? (row as FlatRequestRow).avatarUrl : currentUser.avatarUrl;
                    const rType = isRowObject ? (row as FlatRequestRow).type : row.type;
                    const rStart = isRowObject ? (row as FlatRequestRow).startDate : row.startDate;
                    const rEnd = isRowObject ? (row as FlatRequestRow).endDate : row.endDate;
                    const rRemarks = isRowObject ? (row as FlatRequestRow).remarks : row.remarks;
                    const rStatus = isRowObject ? (row as FlatRequestRow).status : row.status;
                    const rComment = isRowObject ? (row as FlatRequestRow).adminComment : row.adminComment;

                    return (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                        {isAdminOrHR && (
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img 
                              src={avatar} 
                              alt={empName} 
                              className="h-7 w-7 rounded-full border border-white/10 object-cover"
                            />
                            <span className="font-semibold text-white">{empName}</span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded">
                            {rType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-300">
                          {rStart} to {rEnd}
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {days} days
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 max-w-xs truncate">
                          {rRemarks || '—'}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(rStatus)}
                        </td>
                        <td className="px-6 py-4 text-xs italic text-indigo-400 font-medium">
                          {rComment || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No historical requests located.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Apply Leave Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d16]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setApplyModalOpen(false)} />

          <div className="relative w-full max-w-md rounded-2xl bg-[#131b2e] border border-white/10 p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="font-extrabold text-white text-base">Apply for Leave</h3>
                <p className="text-xs text-gray-400 mt-0.5">Submit a time-off application for manager review.</p>
              </div>

              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2 rounded-lg text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Type Select */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="PAID">Paid Time Off (PTO)</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Start Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none cursor-pointer"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">End Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 outline-none cursor-pointer"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Remarks / Reason</label>
                <textarea
                  rows={3}
                  className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none resize-none"
                  placeholder="State the reason for your leave request..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              {/* Medical Certificate File Upload */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Attachments (Optional)</label>
                <div className="relative border border-dashed border-white/10 hover:border-indigo-500/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setAttachmentName(file.name);
                    }}
                  />
                  <FileUp className="h-5 w-5 text-gray-500 mx-auto mb-1.5" />
                  <span className="block text-xs text-indigo-400 font-semibold truncate">
                    {attachmentName ? attachmentName : "Upload Medical Certificate / Notes"}
                  </span>
                  <span className="block text-[9px] text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm transition-all"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Dayflow HRMS System. Real-time portal sandbox.</p>
      </footer>
    </div>
  );
}
