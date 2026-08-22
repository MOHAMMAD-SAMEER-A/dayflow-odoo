"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialEmployees, MockEmployee, MockAttendance, MockTimeOffRequest, MockSalaryStructure } from '../lib/mock-data';
import { TimeOffStatus } from '../types/hrms';
import { generateEmployeeId, normalizeNameString, getCompanyPrefix } from '../utils/employee';
import { signToken } from '../lib/auth';

interface AddEmployeeFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  department: string;
  dateOfJoining: string;
  nationalId: string;
  role: 'EMPLOYEE' | 'HR_OFFICER' | 'ADMIN';
  monthlyWage: number;
}

interface HRMSContextType {
  employees: MockEmployee[];
  currentUser: MockEmployee | null;
  login: (emailOrId: string, pass: string) => boolean;
  logout: () => void;
  registerCompany: (companyName: string, adminName: string, email: string, phone: string, pass: string) => MockEmployee;
  addEmployeeByAdmin: (fields: AddEmployeeFields) => { employee: MockEmployee; tempPass: string };
  switchUser: (id: string) => void;
  toggleCheckIn: () => void;
  applyForLeave: (request: { type: 'PAID' | 'SICK' | 'UNPAID'; startDate: string; endDate: string; remarks: string; attachmentUrl?: string }) => void;
  updateSalary: (employeeId: string, monthlyWage: number, workingDaysPerWeek: number, basicPercentage: number, hraPercentage: number, standardAllowancePercentage: number, performanceBonusPercentage: number, fixedAllowance: number, pfDeduction: number, professionalTax: number) => void;
  handleTimeOffApproval: (employeeId: string, requestId: string, status: TimeOffStatus, adminComment?: string) => void;
  updatePassword: (employeeId: string, newPass: string) => boolean;
  refreshState: () => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

// Helper to count working days (skipping Saturday & Sunday)
function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
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

export function HRMSStateProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<MockEmployee[]>([]);
  const [currentUser, setCurrentUser] = useState<MockEmployee | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or mock data
  useEffect(() => {
    const storedEmployees = localStorage.getItem('dayflow_employees');
    const storedCurrentUserId = localStorage.getItem('dayflow_current_user_id');

    let loadedEmployees: MockEmployee[] = [];
    if (storedEmployees) {
      try {
        loadedEmployees = JSON.parse(storedEmployees);
      } catch (e) {
        loadedEmployees = initialEmployees;
      }
    } else {
      loadedEmployees = initialEmployees;
      localStorage.setItem('dayflow_employees', JSON.stringify(initialEmployees));
    }

    setEmployees(loadedEmployees);

    let activeUser: MockEmployee | null = null;
    if (storedCurrentUserId) {
      const match = loadedEmployees.find(e => e.id === storedCurrentUserId);
      if (match) {
        activeUser = match;
        // Sync cookie on load
        signToken({
          userId: match.id,
          employeeId: match.employeeId,
          email: match.email,
          role: match.role,
          companyName: match.companyName
        }).then(token => {
          document.cookie = `dayflow_token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
        });
      }
    }

    setCurrentUser(activeUser);
    setIsLoaded(true);
  }, []);

  // Save updates to LocalStorage helper
  const saveState = (updatedList: MockEmployee[], activeUser: MockEmployee | null) => {
    setEmployees(updatedList);
    localStorage.setItem('dayflow_employees', JSON.stringify(updatedList));
    if (activeUser) {
      const refreshedActive = updatedList.find(e => e.id === activeUser.id) || activeUser;
      setCurrentUser(refreshedActive);
      localStorage.setItem('dayflow_current_user_id', refreshedActive.id);
    } else {
      setCurrentUser(null);
      localStorage.removeItem('dayflow_current_user_id');
    }
  };

  const login = (emailOrId: string, pass: string): boolean => {
    const query = emailOrId.trim().toLowerCase();
    const match = employees.find(
      (e) => e.email.toLowerCase() === query || e.employeeId.toLowerCase() === query
    );
    if (match) {
      setCurrentUser(match);
      localStorage.setItem('dayflow_current_user_id', match.id);

      // Set cookie asynchronously
      signToken({
        userId: match.id,
        employeeId: match.employeeId,
        email: match.email,
        role: match.role,
        companyName: match.companyName
      }).then(token => {
        document.cookie = `dayflow_token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
      });

      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dayflow_current_user_id');
    // Clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'dayflow_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    }
  };

  const registerCompany = (companyName: string, adminName: string, email: string, phone: string, pass: string): MockEmployee => {
    const nameParts = adminName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const companyPrefix = getCompanyPrefix(companyName);
    const joiningYear = new Date().getFullYear();

    // First Admin Employee is count = 1
    const employeeId = generateEmployeeId({
      companyName,
      firstName,
      lastName,
      dateOfJoining: joiningYear,
      sequentialCount: 1
    });

    const newAdmin: MockEmployee = {
      id: `usr-admin-${Date.now()}`,
      employeeId,
      email: email.toLowerCase(),
      role: 'ADMIN',
      companyName,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Default avatar
      firstName,
      lastName,
      phone,
      address: '',
      jobTitle: 'Company Admin / Founder',
      department: 'Executive Office',
      aboutMe: `Administrator account for ${companyName}.`,
      skills: ['Management', 'Strategy'],
      certifications: [],
      dateOfJoining: new Date().toISOString().split('T')[0],
      bankDetails: {
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountHolderName: `${firstName} ${lastName}`
      },
      nationalId: '',
      presence: false,
      attendanceHistory: [],
      timeOffRequests: [],
      timeOffBalances: { paid: 24, sick: 10 },
      salaryStructure: {
        monthlyWage: 10000,
        yearlyWage: 120000,
        workingDaysPerWeek: 5,
        basicPercentage: 50,
        hraPercentage: 20,
        standardAllowancePercentage: 8.33,
        performanceBonusPercentage: 8.33,
        fixedAllowance: 1334,
        pfDeduction: 0,
        professionalTax: 0
      }
    };

    const updatedEmployees = [...employees, newAdmin];
    saveState(updatedEmployees, newAdmin);

    // Set cookie asynchronously
    signToken({
      userId: newAdmin.id,
      employeeId: newAdmin.employeeId,
      email: newAdmin.email,
      role: newAdmin.role,
      companyName: newAdmin.companyName
    }).then(token => {
      document.cookie = `dayflow_token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
    });

    return newAdmin;
  };

  const addEmployeeByAdmin = (fields: AddEmployeeFields): { employee: MockEmployee; tempPass: string } => {
    // 1. Calculate prefix and initials
    const companyName = currentUser?.companyName || "Odoo Project";
    const companyPrefix = getCompanyPrefix(companyName);
    const yearStr = String(new Date(fields.dateOfJoining).getFullYear());

    // 2. Count existing users with matching company prefix to avoid duplicate sequences
    const matchingUsers = employees.filter(e => e.employeeId.startsWith(companyPrefix));
    
    // Find highest count for this year/company
    const regex = new RegExp(`^${companyPrefix}[A-Z]{4}${yearStr}(\\d+)$`);
    let maxSeq = 0;
    matchingUsers.forEach((u) => {
      const match = u.employeeId.match(regex);
      if (match) {
        const seq = parseInt(match[1], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    });
    const nextSeq = maxSeq + 1;

    const employeeId = generateEmployeeId({
      companyName,
      firstName: fields.firstName,
      lastName: fields.lastName,
      dateOfJoining: fields.dateOfJoining,
      sequentialCount: nextSeq
    });

    // 3. Auto-generate temp password (as required by Excalidraw note)
    const tempPass = `DF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newEmployee: MockEmployee = {
      id: `usr-emp-${Date.now()}`,
      employeeId,
      email: fields.email.toLowerCase(),
      role: fields.role,
      companyName,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      firstName: fields.firstName,
      lastName: fields.lastName,
      phone: fields.phone,
      address: fields.address,
      jobTitle: fields.jobTitle,
      department: fields.department,
      aboutMe: `Registered staff profile. Job: ${fields.jobTitle}.`,
      skills: [],
      certifications: [],
      dateOfJoining: fields.dateOfJoining,
      bankDetails: {
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountHolderName: `${fields.firstName} ${fields.lastName}`
      },
      nationalId: fields.nationalId,
      presence: false,
      attendanceHistory: [],
      timeOffRequests: [],
      timeOffBalances: { paid: 24, sick: 10 },
      salaryStructure: {
        monthlyWage: fields.monthlyWage,
        yearlyWage: fields.monthlyWage * 12,
        workingDaysPerWeek: 5,
        basicPercentage: 50,
        hraPercentage: 20,
        standardAllowancePercentage: 8.33,
        performanceBonusPercentage: 8.33,
        fixedAllowance: Math.round((fields.monthlyWage - (fields.monthlyWage * 0.8666)) * 100) / 100,
        pfDeduction: 0,
        professionalTax: 0
      }
    };

    const updatedEmployees = [...employees, newEmployee];
    saveState(updatedEmployees, currentUser);
    return { employee: newEmployee, tempPass };
  };

  const switchUser = (id: string) => {
    const match = employees.find(e => e.id === id);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem('dayflow_current_user_id', match.id);
    }
  };

  const toggleCheckIn = () => {
    if (!currentUser) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const nowISO = new Date().toISOString();

    const updatedEmployees = employees.map((emp) => {
      if (emp.id !== currentUser.id) return emp;

      const isCheckingIn = !emp.presence;
      let history = [...emp.attendanceHistory];

      if (isCheckingIn) {
        history = history.filter(att => att.date !== todayStr);
        const newRecord: MockAttendance = {
          id: `att-${Date.now()}`,
          date: todayStr,
          checkInTime: nowISO,
          status: 'PRESENT'
        };
        history.unshift(newRecord);
      } else {
        const todayRecordIndex = history.findIndex(att => att.date === todayStr);
        if (todayRecordIndex > -1) {
          const record = history[todayRecordIndex];
          const checkOut = nowISO;
          let hours = 0;
          if (record.checkInTime) {
            const diffMs = new Date(checkOut).getTime() - new Date(record.checkInTime).getTime();
            hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
          }
          
          history[todayRecordIndex] = {
            ...record,
            checkOutTime: checkOut,
            totalHours: hours,
            status: hours >= 8 ? 'PRESENT' : (hours >= 4 ? 'HALF_DAY' : 'PRESENT')
          };
        } else {
          const newRecord: MockAttendance = {
            id: `att-${Date.now()}`,
            date: todayStr,
            checkInTime: nowISO,
            checkOutTime: nowISO,
            totalHours: 0.1,
            status: 'PRESENT'
          };
          history.unshift(newRecord);
        }
      }

      return {
        ...emp,
        presence: isCheckingIn,
        attendanceHistory: history
      };
    });

    saveState(updatedEmployees, currentUser);
  };

  const applyForLeave = (request: { type: 'PAID' | 'SICK' | 'UNPAID'; startDate: string; endDate: string; remarks: string; attachmentUrl?: string }) => {
    if (!currentUser) return;

    const newRequest: MockTimeOffRequest = {
      id: `to-${Date.now()}`,
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      remarks: request.remarks,
      attachmentUrl: request.attachmentUrl || undefined,
      status: 'PENDING'
    };

    const updatedEmployees = employees.map((emp) => {
      if (emp.id !== currentUser.id) return emp;
      return {
        ...emp,
        timeOffRequests: [newRequest, ...emp.timeOffRequests]
      };
    });

    saveState(updatedEmployees, currentUser);
  };

  const updateSalary = (
    employeeId: string, 
    monthlyWage: number,
    workingDaysPerWeek: number,
    basicPercentage: number,
    hraPercentage: number,
    standardAllowancePercentage: number,
    performanceBonusPercentage: number,
    fixedAllowance: number,
    pfDeduction: number,
    professionalTax: number
  ) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.id !== employeeId) return emp;
      const salaryStructure: MockSalaryStructure = {
        monthlyWage,
        yearlyWage: monthlyWage * 12,
        workingDaysPerWeek,
        basicPercentage,
        hraPercentage,
        standardAllowancePercentage,
        performanceBonusPercentage,
        fixedAllowance,
        pfDeduction,
        professionalTax
      };
      return {
        ...emp,
        salaryStructure
      };
    });

    saveState(updatedEmployees, currentUser);
  };

  const handleTimeOffApproval = (employeeId: string, requestId: string, status: TimeOffStatus, adminComment?: string) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.id !== employeeId) return emp;

      let balances = { ...emp.timeOffBalances };
      const requests = emp.timeOffRequests.map((req) => {
        if (req.id !== requestId) return req;

        if (status === 'APPROVED' && req.status !== 'APPROVED') {
          const days = calculateWorkingDays(req.startDate, req.endDate);
          if (req.type === 'PAID') {
            balances.paid = Math.max(0, balances.paid - days);
          } else if (req.type === 'SICK') {
            balances.sick = Math.max(0, balances.sick - days);
          }
        }

        return {
          ...req,
          status,
          adminComment: adminComment || undefined
        };
      });

      return {
        ...emp,
        timeOffBalances: balances,
        timeOffRequests: requests
      };
    });

    saveState(updatedEmployees, currentUser);
  };

  const updatePassword = (employeeId: string, newPass: string): boolean => {
    if (!newPass || newPass.length < 8) return false;
    return true;
  };

  const refreshState = () => {
    const storedEmployees = localStorage.getItem('dayflow_employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <HRMSContext.Provider value={{
      employees,
      currentUser,
      login,
      logout,
      registerCompany,
      addEmployeeByAdmin,
      switchUser,
      toggleCheckIn,
      applyForLeave,
      updateSalary,
      handleTimeOffApproval,
      updatePassword,
      refreshState
    }}>
      {children}
    </HRMSContext.Provider>
  );
}

export function useHRMS() {
  const context = useContext(HRMSContext);
  if (context === undefined) {
    throw new Error('useHRMS must be used within a HRMSStateProvider');
  }
  return context;
}
