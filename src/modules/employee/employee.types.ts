export interface Employee {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  created_at: string;
  updated_at: string;
}

export type EmployeeResponse = Omit<Employee, 'salary'> & { salary: number };

export function serializeEmployee(employee: Employee): EmployeeResponse {
  return {
    ...employee,
    salary: employee.salary / 100, // Convert from cents to decimal
  };
}

export interface CreateEmployeeDTO {
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
}

export interface UpdateEmployeeDTO {
  full_name?: string;
  job_title?: string;
  country?: string;
  salary?: number;
}

export interface DeductionBreakdown {
  tds: number;
  total: number;
}

export interface SalaryCalculation {
  employee_id: number;
  full_name: string;
  country: string;
  gross_salary: number;
  deductions: DeductionBreakdown;
  net_salary: number;
}

export interface SalaryMetricsByCountry {
  country: string;
  minimum_salary: number;
  maximum_salary: number;
  average_salary: number;
  employee_count: number;
}

export interface SalaryMetricsByJobTitle {
  job_title: string;
  average_salary: number;
  employee_count: number;
}