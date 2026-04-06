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
  grossSalary: number,
  country: string
): DeductionBreakdown {
  const tdsRate = DEDUCTION_RULES[country.toLowerCase()] ?? 0;
  const tds = Number((grossSalary * tdsRate).toFixed(2));

  return {
    tds,
    total: tds,
  };
}

export function calculateSalary(employee: Employee): SalaryCalculation {
  const deductions = calculateDeductions(employee.salary, employee.country);
  const netSalary = Number((employee.salary - deductions.total).toFixed(2));

  return {
    employee_id: employee.id,
    full_name: employee.full_name,
    country: employee.country,
    gross_salary: employee.salary,
    deductions,
    net_salary: netSalary,
  };
}