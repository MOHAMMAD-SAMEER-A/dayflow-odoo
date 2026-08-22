import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with default HRMS users...');

  const salt = await bcrypt.genSalt(10);
  
  // 1. Admin Account
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      employeeId: 'OIADMI20240001',
      email: 'admin@dayflow.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      companyName: 'Odoo India',
      employeeProfile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+1 (555) 111-2222',
          address: 'Odoo India HQ, Bangalore',
          jobTitle: 'Company Admin / Founder',
          department: 'Executive Office',
          dateOfJoining: new Date('2024-01-01'),
          nationalId: 'NID-ADMIN-01',
          skills: ['Management', 'Security', 'Strategy'],
          certifications: ['Certified HR Specialist'],
          bankDetails: {
            bankName: 'State Bank of India',
            accountNumber: '••••1111',
            routingNumber: 'SBIN0001234',
            accountHolderName: 'Admin User',
          },
        },
      },
      salaryStructure: {
        create: {
          monthlyWage: 15000.00,
          yearlyWage: 180000.00,
          workingDaysPerWeek: 5,
          basicPercentage: 50.00,
          hraPercentage: 20.00,
          standardAllowancePercentage: 10.00,
          performanceBonusPercentage: 10.00,
          fixedAllowance: 1500.00,
          pfDeduction: 1200.00,
          professionalTax: 200.00,
        },
      },
    },
  });
  console.log('Admin seeded successfully:', admin.email);

  // 2. HR Officer Account
  const hrPasswordHash = await bcrypt.hash('hr123456', salt);
  const hr = await prisma.user.upsert({
    where: { email: 'hr@dayflow.com' },
    update: {},
    create: {
      employeeId: 'OIHRUS20240002',
      email: 'hr@dayflow.com',
      passwordHash: hrPasswordHash,
      role: Role.HR_OFFICER,
      companyName: 'Odoo India',
      employeeProfile: {
        create: {
          firstName: 'HR',
          lastName: 'User',
          phone: '+1 (555) 333-4444',
          address: 'Odoo India HQ, Bangalore',
          jobTitle: 'HR Officer',
          department: 'Human Resources',
          dateOfJoining: new Date('2024-01-02'),
          nationalId: 'NID-HR-02',
          skills: ['Talent Acquisition', 'Employee Relations'],
          certifications: ['SHRM Certified Professional'],
          bankDetails: {
            bankName: 'HDFC Bank',
            accountNumber: '••••2222',
            routingNumber: 'HDFC0005678',
            accountHolderName: 'HR User',
          },
        },
      },
      salaryStructure: {
        create: {
          monthlyWage: 8000.00,
          yearlyWage: 96000.00,
          workingDaysPerWeek: 5,
          basicPercentage: 50.00,
          hraPercentage: 20.00,
          standardAllowancePercentage: 10.00,
          performanceBonusPercentage: 10.00,
          fixedAllowance: 800.00,
          pfDeduction: 640.00,
          professionalTax: 200.00,
        },
      },
    },
  });
  console.log('HR Officer seeded successfully:', hr.email);

  // 3. Regular Employee Account
  const employeePasswordHash = await bcrypt.hash('employee123', salt);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      employeeId: 'OIEMPO20240003',
      email: 'employee@dayflow.com',
      passwordHash: employeePasswordHash,
      role: Role.EMPLOYEE,
      companyName: 'Odoo India',
      employeeProfile: {
        create: {
          firstName: 'Employee',
          lastName: 'User',
          phone: '+1 (555) 555-6666',
          address: 'Odoo India HQ, Bangalore',
          jobTitle: 'Software Engineer',
          department: 'Engineering',
          dateOfJoining: new Date('2024-01-03'),
          nationalId: 'NID-EMP-03',
          skills: ['React', 'Next.js', 'TypeScript', 'Node.js'],
          certifications: ['AWS Cloud Practitioner'],
          bankDetails: {
            bankName: 'ICICI Bank',
            accountNumber: '••••3333',
            routingNumber: 'ICIC0009876',
            accountHolderName: 'Employee User',
          },
        },
      },
      salaryStructure: {
        create: {
          monthlyWage: 6000.00,
          yearlyWage: 72000.00,
          workingDaysPerWeek: 5,
          basicPercentage: 50.00,
          hraPercentage: 20.00,
          standardAllowancePercentage: 10.00,
          performanceBonusPercentage: 10.00,
          fixedAllowance: 600.00,
          pfDeduction: 480.00,
          professionalTax: 200.00,
        },
      },
    },
  });
  console.log('Regular Employee seeded successfully:', employee.email);

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
