-- Create Role Enum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR_OFFICER', 'EMPLOYEE');

-- Create AttendanceStatus Enum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE');

-- Create TimeOffType Enum
CREATE TYPE "TimeOffType" AS ENUM ('PAID', 'SICK', 'UNPAID');

-- Create TimeOffStatus Enum
CREATE TYPE "TimeOffStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Enable UUID extension (useful for schema setup if standard database uuid functions are missing)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users Table
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employee_id" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "company_name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_employee_id_key" UNIQUE ("employee_id"),
    CONSTRAINT "users_email_key" UNIQUE ("email")
);

-- Create employee_profiles Table
CREATE TABLE "employee_profiles" (
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "address" TEXT,
    "job_title" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "about_me" TEXT,
    "skills" TEXT[] NOT NULL DEFAULT '{}',
    "certifications" TEXT[] NOT NULL DEFAULT '{}',
    "date_of_joining" DATE NOT NULL,
    "bank_details" JSONB,
    "national_id" VARCHAR(50),

    CONSTRAINT "employee_profiles_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "employee_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create attendance Table
CREATE TABLE "attendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "check_in_time" TIMESTAMPTZ(6),
    "check_out_time" TIMESTAMPTZ(6),
    "total_hours" DECIMAL(5,2),
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_user_id_date_key" UNIQUE ("user_id", "date")
);

-- Create time_off_requests Table
CREATE TABLE "time_off_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "TimeOffType" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "remarks" TEXT,
    "attachment_url" TEXT,
    "status" "TimeOffStatus" NOT NULL DEFAULT 'PENDING',
    "admin_comment" TEXT,

    CONSTRAINT "time_off_requests_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "time_off_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "time_off_requests_date_check" CHECK ("end_date" >= "start_date")
);

-- Create salary_structures Table
CREATE TABLE "salary_structures" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "monthly_wage" DECIMAL(12,2) NOT NULL,
    "yearly_wage" DECIMAL(12,2) NOT NULL,
    "working_days_per_week" INTEGER NOT NULL DEFAULT 5,
    "basic_percentage" DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    "hra_percentage" DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    "standard_allowance_percentage" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "performance_bonus_percentage" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "fixed_allowance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "pf_deduction" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "professional_tax" DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "salary_structures_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "salary_structures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "salary_structures_user_id_key" UNIQUE ("user_id")
);

-- Create indexes for performance optimization
CREATE INDEX "users_role_idx" ON "users" ("role");
CREATE INDEX "employee_profiles_department_idx" ON "employee_profiles" ("department");
CREATE INDEX "attendance_date_idx" ON "attendance" ("date");
CREATE INDEX "time_off_requests_status_idx" ON "time_off_requests" ("status");
