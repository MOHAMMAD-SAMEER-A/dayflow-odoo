import { Role, AttendanceStatus, TimeOffType, TimeOffStatus } from '../types/hrms';

export interface MockAttendance {
  id: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // ISO
  checkOutTime?: string; // ISO
  totalHours?: number;
  status: AttendanceStatus;
}

export interface MockTimeOffRequest {
  id: string;
  type: TimeOffType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  remarks?: string;
  attachmentUrl?: string;
  status: TimeOffStatus;
  adminComment?: string;
}

export interface MockSalaryStructure {
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek: number;
  basicPercentage: number;
  hraPercentage: number;
  standardAllowancePercentage: number;
  performanceBonusPercentage: number;
  fixedAllowance: number;
  pfDeduction: number;
  professionalTax: number;
}

export interface MockEmployee {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  companyName: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  jobTitle: string;
  department: string;
  aboutMe: string;
  skills: string[];
  certifications: string[];
  dateOfJoining: string; // YYYY-MM-DD
  bankDetails: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
  nationalId: string;
  presence: boolean;
  attendanceHistory: MockAttendance[];
  timeOffRequests: MockTimeOffRequest[];
  salaryStructure: MockSalaryStructure;
  timeOffBalances: {
    paid: number;
    sick: number;
  };
}

export const initialEmployees: MockEmployee[] = [
  {
    id: "usr-admin-oi-01",
    employeeId: "OIADMI20240001",
    email: "admin@dayflow.com",
    role: "ADMIN",
    companyName: "Odoo India",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "Admin",
    lastName: "User",
    phone: "+1 (555) 111-2222",
    address: "Odoo India HQ, Bangalore",
    jobTitle: "Company Admin / Founder",
    department: "Executive Office",
    aboutMe: "System Administrator for Dayflow HRMS Odoo India.",
    skills: ["Management", "Security", "Strategy"],
    certifications: ["Certified HR Specialist"],
    dateOfJoining: "2024-01-01",
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "••••1111",
      routingNumber: "SBIN0001234",
      accountHolderName: "Admin User"
    },
    nationalId: "NID-ADMIN-01",
    presence: true,
    timeOffBalances: { paid: 24, sick: 10 },
    attendanceHistory: [],
    timeOffRequests: [],
    salaryStructure: {
      monthlyWage: 15000,
      yearlyWage: 180000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 10,
      performanceBonusPercentage: 10,
      fixedAllowance: 1500,
      pfDeduction: 1200,
      professionalTax: 200
    }
  },
  {
    id: "usr-hr-oi-02",
    employeeId: "OIHRUS20240002",
    email: "hr@dayflow.com",
    role: "HR_OFFICER",
    companyName: "Odoo India",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "HR",
    lastName: "User",
    phone: "+1 (555) 333-4444",
    address: "Odoo India HQ, Bangalore",
    jobTitle: "HR Manager",
    department: "Human Resources",
    aboutMe: "HR Officer managing employees, presence logs, and time-off operations.",
    skills: ["Talent Acquisition", "Employee Relations", "HR Strategy"],
    certifications: ["SHRM Certified Professional"],
    dateOfJoining: "2024-01-02",
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "••••2222",
      routingNumber: "HDFC0005678",
      accountHolderName: "HR User"
    },
    nationalId: "NID-HR-02",
    presence: true,
    timeOffBalances: { paid: 20, sick: 8 },
    attendanceHistory: [],
    timeOffRequests: [],
    salaryStructure: {
      monthlyWage: 8000,
      yearlyWage: 96000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 10,
      performanceBonusPercentage: 10,
      fixedAllowance: 800,
      pfDeduction: 640,
      professionalTax: 200
    }
  },
  {
    id: "usr-emp-oi-03",
    employeeId: "OIEMPO20240003",
    email: "employee@dayflow.com",
    role: "EMPLOYEE",
    companyName: "Odoo India",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "Employee",
    lastName: "User",
    phone: "+1 (555) 555-6666",
    address: "Odoo India HQ, Bangalore",
    jobTitle: "Software Engineer",
    department: "Engineering",
    aboutMe: "Full-Stack developer at Odoo India working on internal tools.",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    certifications: ["AWS Cloud Practitioner"],
    dateOfJoining: "2024-01-03",
    bankDetails: {
      bankName: "ICICI Bank",
      accountNumber: "••••3333",
      routingNumber: "ICIC0009876",
      accountHolderName: "Employee User"
    },
    nationalId: "NID-EMP-03",
    presence: false,
    timeOffBalances: { paid: 22, sick: 9 },
    attendanceHistory: [],
    timeOffRequests: [],
    salaryStructure: {
      monthlyWage: 6000,
      yearlyWage: 72000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 10,
      performanceBonusPercentage: 10,
      fixedAllowance: 600,
      pfDeduction: 480,
      professionalTax: 200
    }
  },
  {
    id: "usr-admin-001",
    employeeId: "ODMASA20240001",
    email: "m.sameer@odoo.com",
    role: "ADMIN",
    companyName: "Odoo Project",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "Mohammad",
    lastName: "Sameer",
    phone: "+1 (555) 123-4567",
    address: "742 Evergreen Terrace, Springfield, OR",
    jobTitle: "Senior Backend Architect",
    department: "Engineering",
    aboutMe: "Senior Backend Architect with 10+ years designing enterprise microservices, transactional databases, and core HR systems.",
    skills: ["PostgreSQL", "Node.js", "TypeScript", "Next.js", "Docker", "Prisma", "Redis"],
    certifications: ["AWS Solutions Architect", "Professional Scrum Master II"],
    dateOfJoining: "2024-01-10",
    bankDetails: {
      bankName: "Chase Bank",
      accountNumber: "••••6789",
      routingNumber: "021000021",
      accountHolderName: "Mohammad Sameer"
    },
    nationalId: "NID-88726-US",
    presence: true,
    timeOffBalances: { paid: 22, sick: 9 },
    attendanceHistory: [
      { id: "att-1", date: "2026-08-21", checkInTime: "2026-08-21T09:02:00Z", checkOutTime: "2026-08-21T17:32:00Z", totalHours: 8.5, status: "PRESENT" },
      { id: "att-2", date: "2026-08-20", checkInTime: "2026-08-20T08:55:00Z", checkOutTime: "2026-08-20T17:00:00Z", totalHours: 8.08, status: "PRESENT" }
    ],
    timeOffRequests: [
      { id: "to-1", type: "PAID", startDate: "2026-09-10", endDate: "2026-09-12", remarks: "Family vacation trip", status: "PENDING" }
    ],
    salaryStructure: {
      monthlyWage: 12000,
      yearlyWage: 144000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 8.33,
      performanceBonusPercentage: 8.33,
      fixedAllowance: 1600.8,
      pfDeduction: 1440,
      professionalTax: 200
    }
  },
  {
    id: "usr-hr-002",
    email: "s.jenkins@odoo.com",
    employeeId: "ODSAJE20240002",
    role: "HR_OFFICER",
    companyName: "Odoo Project",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "Sarah",
    lastName: "Jenkins",
    phone: "+1 (555) 987-6543",
    address: "123 Maple Street, Portland, OR",
    jobTitle: "HR Director",
    department: "Human Resources",
    aboutMe: "HR executive dedicated to building collaborative workplaces, developing talent pathways, and managing employee relations.",
    skills: ["Talent Acquisition", "Employee Relations", "HR Policies", "Conflict Resolution", "Office Suite"],
    certifications: ["SHRM Senior Certified Professional (SHRM-SCP)"],
    dateOfJoining: "2024-02-15",
    bankDetails: {
      bankName: "Bank of America",
      accountNumber: "••••4321",
      routingNumber: "026009593",
      accountHolderName: "Sarah Jenkins"
    },
    nationalId: "NID-99281-US",
    presence: true,
    timeOffBalances: { paid: 18, sick: 7 },
    attendanceHistory: [
      { id: "att-3", date: "2026-08-21", checkInTime: "2026-08-21T08:45:00Z", checkOutTime: "2026-08-21T17:00:00Z", totalHours: 8.25, status: "PRESENT" },
      { id: "att-4", date: "2026-08-20", checkInTime: "2026-08-20T08:50:00Z", checkOutTime: "2026-08-20T17:15:00Z", totalHours: 8.42, status: "PRESENT" }
    ],
    timeOffRequests: [
      { id: "to-2", type: "SICK", startDate: "2026-07-05", endDate: "2026-07-06", remarks: "Dental checkup and recovery", status: "APPROVED", adminComment: "Approved. Rest up." }
    ],
    salaryStructure: {
      monthlyWage: 8500,
      yearlyWage: 102000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 8.33,
      performanceBonusPercentage: 8.33,
      fixedAllowance: 1133.9,
      pfDeduction: 1020,
      professionalTax: 150
    }
  },
  {
    id: "usr-emp-003",
    email: "j.doe@odoo.com",
    employeeId: "ODJODO20240003",
    role: "EMPLOYEE",
    companyName: "Odoo Project",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 234-5678",
    address: "555 Cedar Lane, Seattle, WA",
    jobTitle: "Frontend Engineer",
    department: "Engineering",
    aboutMe: "Frontend developer specializing in building highly visual UI/UX systems using Tailwind, React, and Next.js.",
    skills: ["React", "Next.js", "Tailwind CSS", "HTML5/CSS3", "Framer Motion", "Figma"],
    certifications: ["Certified React Developer"],
    dateOfJoining: "2024-03-01",
    bankDetails: {
      bankName: "Wells Fargo",
      accountNumber: "••••5566",
      routingNumber: "121000248",
      accountHolderName: "John Doe"
    },
    nationalId: "NID-11223-US",
    presence: false,
    timeOffBalances: { paid: 24, sick: 10 },
    attendanceHistory: [
      { id: "att-5", date: "2026-08-21", checkInTime: "2026-08-21T09:15:00Z", checkOutTime: "2026-08-21T18:00:00Z", totalHours: 8.75, status: "PRESENT" },
      { id: "att-6", date: "2026-08-20", checkInTime: "2026-08-20T09:00:00Z", checkOutTime: "2026-08-20T17:00:00Z", totalHours: 8.00, status: "PRESENT" }
    ],
    timeOffRequests: [
      { id: "to-3", type: "PAID", startDate: "2026-08-25", endDate: "2026-08-27", remarks: "Personal matters to attend", status: "PENDING" }
    ],
    salaryStructure: {
      monthlyWage: 6000,
      yearlyWage: 72000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 8.33,
      performanceBonusPercentage: 8.33,
      fixedAllowance: 800.4,
      pfDeduction: 720,
      professionalTax: 100
    }
  },
  {
    id: "usr-emp-004",
    email: "j.smith@odoo.com",
    employeeId: "ODJASM20240004",
    role: "EMPLOYEE",
    companyName: "Odoo Project",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1 (555) 345-6789",
    address: "888 Oak Ave, San Francisco, CA",
    jobTitle: "Product Manager",
    department: "Product Management",
    aboutMe: "Strategic product manager focused on driving roadmaps, cross-team synergy, and delivering consumer value.",
    skills: ["Product Roadmap", "Agile/Jira", "Market Analysis", "UX Principles", "SQL Core"],
    certifications: ["Certified Product Manager (CPM)", "Scrum Alliance PO"],
    dateOfJoining: "2024-04-10",
    bankDetails: {
      bankName: "Chase Bank",
      accountNumber: "••••7788",
      routingNumber: "021000021",
      accountHolderName: "Jane Smith"
    },
    nationalId: "NID-44556-US",
    presence: true,
    timeOffBalances: { paid: 20, sick: 8 },
    attendanceHistory: [
      { id: "att-7", date: "2026-08-21", checkInTime: "2026-08-21T09:00:00Z", checkOutTime: "2026-08-21T17:00:00Z", totalHours: 8.00, status: "PRESENT" }
    ],
    timeOffRequests: [],
    salaryStructure: {
      monthlyWage: 9500,
      yearlyWage: 114000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 8.33,
      performanceBonusPercentage: 8.33,
      fixedAllowance: 1267.25,
      pfDeduction: 1140,
      professionalTax: 180
    }
  },
  {
    id: "usr-emp-005",
    email: "d.chen@odoo.com",
    employeeId: "ODDACH20250001",
    role: "EMPLOYEE",
    companyName: "Odoo Project",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "David",
    lastName: "Chen",
    phone: "+1 (555) 456-7890",
    address: "99 Hillside Court, Austin, TX",
    jobTitle: "DevOps Engineer",
    department: "Engineering",
    aboutMe: "Automation enthusiast, specialized in Kubernetes, continuous integration orchestration, and infrastructure scaling.",
    skills: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "AWS Cloud", "Linux Bash"],
    certifications: ["Certified Kubernetes Administrator (CKA)", "AWS SysOps Associate"],
    dateOfJoining: "2025-01-15",
    bankDetails: {
      bankName: "PNC Bank",
      accountNumber: "••••9900",
      routingNumber: "031000053",
      accountHolderName: "David Chen"
    },
    nationalId: "NID-55667-US",
    presence: true,
    timeOffBalances: { paid: 23, sick: 10 },
    attendanceHistory: [
      { id: "att-8", date: "2026-08-21", checkInTime: "2026-08-21T08:30:00Z", checkOutTime: "2026-08-21T18:00:00Z", totalHours: 9.5, status: "PRESENT" }
    ],
    timeOffRequests: [],
    salaryStructure: {
      monthlyWage: 7500,
      yearlyWage: 90000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 8.33,
      performanceBonusPercentage: 8.33,
      fixedAllowance: 1000.5,
      pfDeduction: 900,
      professionalTax: 120
    }
  },
  {
    id: "usr-emp-006",
    email: "e.rostova@odoo.com",
    employeeId: "ODELRO20250002",
    role: "EMPLOYEE",
    companyName: "Odoo Project",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    firstName: "Elena",
    lastName: "Rostova",
    phone: "+1 (555) 567-8901",
    address: "710 Broadway Lane, New York, NY",
    jobTitle: "UI/UX Lead Designer",
    department: "Design",
    aboutMe: "Crafting beautiful interfaces, user journey flows, and high fidelity interactive component prototypes for Web & Mobile platforms.",
    skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Design Systems"],
    certifications: ["Google UX Design Professional Certificate"],
    dateOfJoining: "2025-03-20",
    bankDetails: {
      bankName: "CitiBank",
      accountNumber: "••••1122",
      routingNumber: "021000089",
      accountHolderName: "Elena Rostova"
    },
    nationalId: "NID-66778-US",
    presence: false,
    timeOffBalances: { paid: 24, sick: 10 },
    attendanceHistory: [],
    timeOffRequests: [
      { id: "to-4", type: "UNPAID", startDate: "2026-08-20", endDate: "2026-08-22", remarks: "Moving to a new apartment", status: "APPROVED", adminComment: "Granted." }
    ],
    salaryStructure: {
      monthlyWage: 7000,
      yearlyWage: 84000,
      workingDaysPerWeek: 5,
      basicPercentage: 50,
      hraPercentage: 20,
      standardAllowancePercentage: 8.33,
      performanceBonusPercentage: 8.33,
      fixedAllowance: 933.8,
      pfDeduction: 840,
      professionalTax: 110
    }
  }
];
