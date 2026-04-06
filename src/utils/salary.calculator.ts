import {
  DeductionBreakdown,
  Employee,
  SalaryCalculation,
} from "../modules/employee/employee.types";

const DEDUCTION_RULES: Record<string, number> = {
  india: 0.1,
  "united states": 0.12,
};

export function calculateDeductions(
  grossSalaryInCents: number,
  country: string
): DeductionBreakdown {
  const tdsRate = DEDUCTION_RULES[country.toLowerCase()] ?? 0;
  const tdsInCents = Math.round(grossSalaryInCents * tdsRate);
  const tds = Number((tdsInCents / 100).toFixed(2));

  return {
    tds,
    total: tds,
  };
}

export function calculateSalary(employee: Employee): SalaryCalculation {
  // Employee.salary is stored in cents, convert to decimal for calculations
  const grossSalary = employee.salary / 100;
  const deductions = calculateDeductions(employee.salary, employee.country);
  const netSalary = Number((grossSalary - deductions.total).toFixed(2));

  return {
    employee_id: employee.id,
    full_name: employee.full_name,
    country: employee.country,
    gross_salary: grossSalary,
    deductions,
    net_salary: netSalary,
  };
}