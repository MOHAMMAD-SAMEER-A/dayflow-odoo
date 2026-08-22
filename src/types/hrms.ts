export type Role = 'ADMIN' | 'HR_OFFICER' | 'EMPLOYEE';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export type TimeOffType = 'PAID' | 'SICK' | 'UNPAID';

export type TimeOffStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string; // UUID
  employeeId: string; // ODJODO20240001
  email: string;
  passwordHash: string;
  role: Role;
  companyName: string;
  avatarUrl?: string | null;
  createdAt: Date;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  [key: string]: unknown; // Allow additional custom fields
}

export interface EmployeeProfile {
  userId: string; // UUID (Foreign Key to User.id)
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  jobTitle: string;
  department: string;
  aboutMe?: string | null;
  skills: string[]; // Postgres TEXT[] mapped to TS string[]
  certifications: string[]; // Postgres TEXT[] mapped to TS string[]
  dateOfJoining: Date;
  bankDetails?: BankDetails | null; // Mapped JSONB type
  nationalId?: string | null;
}

export interface Attendance {
  id: string; // UUID
  userId: string; // UUID (Foreign Key to User.id)
  date: Date;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  totalHours?: number | null; // e.g. 8.5
  status: AttendanceStatus;
}

export interface TimeOffRequest {
  id: string; // UUID
  userId: string; // UUID (Foreign Key to User.id)
  type: TimeOffType;
  startDate: Date;
  endDate: Date;
  remarks?: string | null;
  attachmentUrl?: string | null;
  status: TimeOffStatus;
  adminComment?: string | null;
}

export interface SalaryStructure {
  id: string; // UUID
  userId: string; // UUID (Foreign Key to User.id)
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek: number; // e.g., 5
  basicPercentage: number; // e.g., 50.00
  hraPercentage: number; // e.g., 20.00
  standardAllowancePercentage: number; // e.g., 10.00
  performanceBonusPercentage: number; // e.g., 10.00
  fixedAllowance: number;
  pfDeduction: number;
  professionalTax: number;
}

// Authentication DTOs (Data Transfer Objects)
export interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role; // Default to 'EMPLOYEE'
  companyName: string;
  jobTitle: string;
  department: string;
  phone?: string;
  address?: string;
  dateOfJoining?: string; // ISO Date String
  nationalId?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthUserPayload {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  companyName: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: AuthUserPayload;
  token: string;
}
