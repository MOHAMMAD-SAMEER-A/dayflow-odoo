import { z } from 'zod';

export const loginSchema = z.object({
  emailOrId: z.string().min(1, 'Login ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  companyName: z.string()
    .min(1, 'Company Name is required')
    .min(2, 'Company Name must be at least 2 characters'),
  name: z.string()
    .min(1, 'Full Name is required')
    .refine((val) => {
      const parts = val.trim().split(/\s+/);
      return parts.length >= 2 && parts[0].length > 0 && parts[1].length > 0;
    }, {
      message: 'Please enter both first and last name',
    }),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .min(1, 'Phone number is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string()
    .min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;
