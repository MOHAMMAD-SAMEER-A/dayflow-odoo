import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { generateEmployeeId, normalizeNameString } from '@/utils/employee';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'HR_OFFICER', 'EMPLOYEE']).default('EMPLOYEE'),
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfJoining: z
    .string()
    .datetime()
    .or(z.string().date())
    .optional()
    .default(() => new Date().toISOString()),
  nationalId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const email = data.email.toLowerCase();

    // 1. Fail fast if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 400 }
      );
    }

    // 2. Perform employee ID allocation and registration within a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Re-verify inside the transaction lock
      const dupUser = await tx.user.findUnique({
        where: { email },
      });
      if (dupUser) {
        throw new Error('EMAIL_EXISTS');
      }

      const companyPrefix = normalizeNameString(data.companyName).slice(0, 2).padEnd(2, 'X');
      const dateObj = new Date(data.dateOfJoining);
      const yearStr = String(dateObj.getFullYear());

      // Retrieve all current users under this company prefix to locate the maximum sequence number
      const companyUsers = await tx.user.findMany({
        where: {
          employeeId: {
            startsWith: companyPrefix,
          },
        },
        select: {
          employeeId: true,
        },
      });

      // Scan and parse max sequential count
      const regex = new RegExp(`^${companyPrefix}[A-Z]{4}${yearStr}(\\d+)$`);
      let maxSeq = 0;
      for (const u of companyUsers) {
        const match = u.employeeId.match(regex);
        if (match) {
          const seq = parseInt(match[1], 10);
          if (seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
      const nextSeq = maxSeq + 1;

      // Generate the formatted Employee ID
      const employeeId = generateEmployeeId({
        companyName: data.companyName,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfJoining: dateObj,
        sequentialCount: nextSeq,
      });

      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);

      // Create User and empty Profile
      const newUser = await tx.user.create({
        data: {
          employeeId,
          email,
          passwordHash,
          role: data.role,
          companyName: data.companyName,
          employeeProfile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone || null,
              address: data.address || null,
              jobTitle: data.jobTitle,
              department: data.department,
              dateOfJoining: dateObj,
              nationalId: data.nationalId || null,
              skills: [],
              certifications: [],
            },
          },
        },
        select: {
          id: true,
          employeeId: true,
          email: true,
          role: true,
          companyName: true,
          createdAt: true,
          employeeProfile: true,
        },
      });

      return newUser;
    });

    return NextResponse.json(
      {
        message: 'Employee registered successfully',
        user: {
          id: result.id,
          employeeId: result.employeeId,
          email: result.email,
          role: result.role,
          companyName: result.companyName,
          firstName: result.employeeProfile?.firstName,
          lastName: result.employeeProfile?.lastName,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'EMAIL_EXISTS') {
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 400 }
      );
    }
    console.error('Registration handler error:', error);
    return NextResponse.json(
      { error: 'An unexpected database error occurred' },
      { status: 500 }
    );
  }
}
