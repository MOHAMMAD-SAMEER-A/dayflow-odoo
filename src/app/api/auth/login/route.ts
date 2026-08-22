import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // Fetch user and profile details together
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        employeeProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Unified security response to prevent account enumeration
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token containing essential user information
    const token = jwt.sign(
      {
        userId: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 24 hours
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        firstName: user.employeeProfile?.firstName || '',
        lastName: user.employeeProfile?.lastName || '',
      },
    });
  } catch (error) {
    console.error('Login handler error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred' },
      { status: 500 }
    );
  }
}
