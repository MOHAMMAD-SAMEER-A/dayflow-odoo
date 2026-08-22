import './globals.css';
import React from 'react';
import { HRMSStateProvider } from '../context/HRMSContext';

export const metadata = {
  title: 'Dayflow HRMS - Human Resource Management System',
  description: 'Manage employees, salaries, time-off requests, and daily presence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#090d16] text-[#f8fafc] min-h-screen">
        <HRMSStateProvider>
          {children}
        </HRMSStateProvider>
      </body>
    </html>
  );
}
