import {
  calculateDeductions,
  calculateSalary,
} from "../utils/salary.calculator";
import { Employee } from "../modules/employee/employee.types";

describe("salary.calculator", () => {
  const baseEmployee: Employee = {
    id: 1,
    full_name: "Test User",
    job_title: "Engineer",
    country: "India",
    salary: 100000,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  describe("calculateDeductions", () => {
    it("returns 10 percent TDS for India", () => {
      expect(calculateDeductions(100000, "India")).toEqual({
        tds: 10000,
        total: 10000,
      });
    });

    it("returns 12 percent TDS for United States", () => {
      expect(calculateDeductions(100000, "United States")).toEqual({
        tds: 12000,
        total: 12000,
      });
    });

    it("returns zero deductions for unsupported countries", () => {
      expect(calculateDeductions(100000, "Germany")).toEqual({
        tds: 0,
        total: 0,
      });
    });

    it("handles decimal salary values safely", () => {
      expect(calculateDeductions(33333.33, "India")).toEqual({
        tds: 3333.33,
        total: 3333.33,
      });
    });
  });

  describe("calculateSalary", () => {
    it("returns full salary breakdown for India employee", () => {
      expect(calculateSalary(baseEmployee)).toEqual({
        employee_id: 1,
        full_name: "Test User",
        country: "India",
        gross_salary: 100000,
        deductions: {
          tds: 10000,
          total: 10000,
        },
        net_salary: 90000,
      });
    });

    it("returns gross as net when no deductions apply", () => {
      const employee: Employee = {
        ...baseEmployee,
        country: "Germany",
      };

      expect(calculateSalary(employee)).toEqual({
        employee_id: 1,
        full_name: "Test User",
        country: "Germany",
        gross_salary: 100000,
        deductions: {
          tds: 0,
          total: 0,
        },
        net_salary: 100000,
      });
    });
  });
});