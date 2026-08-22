"use client";

import React, { useState, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { MockEmployee } from '../../lib/mock-data';
import { DollarSign, Save, RefreshCw, Calculator } from 'lucide-react';

interface SalaryFormProps {
  employee: MockEmployee;
  onSuccess?: () => void;
}

export default function SalaryForm({ employee, onSuccess }: SalaryFormProps) {
  const { updateSalary } = useHRMS();
  const [monthlyWage, setMonthlyWage] = useState<number>(employee.salaryStructure?.monthlyWage || 5000);
  const [workingDays, setWorkingDays] = useState<number>(employee.salaryStructure?.workingDaysPerWeek || 5);
  const [pfDeduction, setPfDeduction] = useState<number>(employee.salaryStructure?.pfDeduction || 0);
  const [profTax, setProfTax] = useState<number>(employee.salaryStructure?.professionalTax || 0);

  // States for calculated components
  const [yearlyWage, setYearlyWage] = useState<number>(0);
  const [basic, setBasic] = useState<number>(0);
  const [hra, setHra] = useState<number>(0);
  const [standardAllowance, setStandardAllowance] = useState<number>(0);
  const [perfBonus, setPerfBonus] = useState<number>(0);
  const [fixedAllowance, setFixedAllowance] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Constants
  const BASIC_PCT = 50.00;
  const HRA_PCT = 20.00;
  const STD_ALLOW_PCT = 8.33;
  const PERF_BONUS_PCT = 8.33;

  useEffect(() => {
    const monthly = Number(monthlyWage) || 0;
    
    // Auto-calculate components
    const calculatedYearly = monthly * 12;
    const calculatedBasic = Math.round((monthly * (BASIC_PCT / 100)) * 100) / 100;
    const calculatedHra = Math.round((monthly * (HRA_PCT / 100)) * 100) / 100;
    const calculatedStdAllow = Math.round((monthly * (STD_ALLOW_PCT / 100)) * 100) / 100;
    const calculatedPerfBonus = Math.round((monthly * (PERF_BONUS_PCT / 100)) * 100) / 100;
    
    // Sum of all structured parts
    const structuredSum = calculatedBasic + calculatedHra + calculatedStdAllow + calculatedPerfBonus;
    
    // Fixed Allowance (Remainder) = Monthly Wage - Sum of all above
    // Enforce total components equal monthly wage precisely by taking the exact difference
    const calculatedFixed = Math.round((monthly - structuredSum) * 100) / 100;

    setYearlyWage(calculatedYearly);
    setBasic(calculatedBasic);
    setHra(calculatedHra);
    setStandardAllowance(calculatedStdAllow);
    setPerfBonus(calculatedPerfBonus);
    setFixedAllowance(calculatedFixed);
  }, [monthlyWage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSalary(
      employee.id,
      monthlyWage,
      workingDays,
      BASIC_PCT,
      HRA_PCT,
      STD_ALLOW_PCT,
      PERF_BONUS_PCT,
      fixedAllowance,
      pfDeduction,
      profTax
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-gray-200">
      
      {/* Header Info */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Calculator className="h-5 w-5 text-indigo-400" />
        <span className="font-bold text-sm text-gray-300 uppercase tracking-wider">Salary Configuration Structure</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input: Monthly Wage */}
        <div className="form-group">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Monthly Base Wage ($)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="number" 
              required
              className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 5000"
            />
          </div>
        </div>

        {/* Display: Yearly Wage (Auto-calculated) */}
        <div className="form-group">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Yearly Wage (Auto-calc)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-indigo-500" />
            </div>
            <input 
              type="text" 
              readOnly
              className="w-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 rounded-lg pl-9 pr-4 py-2 text-sm outline-none font-bold"
              value={yearlyWage.toLocaleString()}
            />
          </div>
        </div>

        {/* Input: Working Days Per Week */}
        <div className="form-group">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Working Days Per Week</label>
          <select 
            value={workingDays}
            onChange={(e) => setWorkingDays(Number(e.target.value))}
            className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value={4}>4 Days</option>
            <option value={5}>5 Days</option>
            <option value={6}>6 Days</option>
          </select>
        </div>

        {/* Inputs: PF Deduction */}
        <div className="form-group">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Monthly Provident Fund (PF) Deduction ($)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="number" 
              className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={pfDeduction}
              onChange={(e) => setPfDeduction(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>
        </div>

        {/* Inputs: Professional Tax */}
        <div className="form-group">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Monthly Professional Tax Deduction ($)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="number" 
              className="w-full bg-[#0f172a]/60 border border-white/[0.08] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={profTax}
              onChange={(e) => setProfTax(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>
        </div>
      </div>

      {/* Breakdowns Display */}
      <div className="bg-[#0f172a]/40 border border-white/5 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Salary Component Breakdown</h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-400">Basic Salary (50%):</span>
            <span className="font-semibold text-white">${basic.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-400">HRA Allowance (20%):</span>
            <span className="font-semibold text-white">${hra.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-400">Standard Allowance (8.33%):</span>
            <span className="font-semibold text-white">${standardAllowance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-400">Performance Bonus (8.33%):</span>
            <span className="font-semibold text-white">${perfBonus.toFixed(2)}</span>
          </div>
        </div>

        {/* Remainder Section */}
        <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5 mt-2">
          <div className="text-xs">
            <span className="font-bold text-gray-300 block">Fixed Allowance (Remainder)</span>
            <span className="text-gray-500">Monthly Wage - Sum of all above components</span>
          </div>
          <span className="font-extrabold text-white text-lg">${fixedAllowance.toFixed(2)}</span>
        </div>

        {/* Total Validation Checker */}
        <div className="flex justify-between text-xs text-gray-500 pt-2 px-1">
          <span>Formula validation check:</span>
          <span className="text-emerald-400 font-medium">
            Basic + HRA + Std + Perf + Fixed = <strong>${(basic + hra + standardAllowance + perfBonus + fixedAllowance).toFixed(2)}</strong> (100.00%)
          </span>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end pt-2">
        <button 
          type="submit"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-all shadow-lg active:scale-95"
        >
          <Save className="h-4 w-4" />
          {saveSuccess ? 'Changes Saved!' : 'Save Salary Structure'}
        </button>
      </div>

    </form>
  );
}
