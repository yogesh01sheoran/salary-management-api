import { EmployeeRepository } from "./employee.repository";
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SalaryMetricsByCountry,
  SalaryMetricsByJobTitle,
} from "./employee.types";

export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  getAllEmployees(): Employee[] {
    return this.repository.findAll();
  }

  getEmployeeById(id: number): Employee {
    const employee = this.repository.findById(id);
    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  createEmployee(data: CreateEmployeeDTO): Employee {
    return this.repository.create(data);
  }

  updateEmployee(id: number, data: UpdateEmployeeDTO): Employee {
    const updated = this.repository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }
    return updated;
  }

  deleteEmployee(id: number): void {
    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }
  }

  getSalaryMetricsByCountry(country: string): SalaryMetricsByCountry {
    const metrics = this.repository.findMetricsByCountry(country);
    if (!metrics) {
      throw new NotFoundError(
        `No employees found in country: ${country}`
      );
    }
    return metrics;
  }

  getAverageSalaryByJobTitle(jobTitle: string): SalaryMetricsByJobTitle {
    const metrics = this.repository.findAverageSalaryByJobTitle(jobTitle);
    if (!metrics) {
      throw new NotFoundError(
        `No employees found with job title: ${jobTitle}`
      );
    }
    return metrics;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}