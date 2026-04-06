import { EmployeeRepository } from "./employee.repository";
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SalaryMetricsByCountry,
  SalaryMetricsByJobTitle,
  serializeEmployee,
} from "./employee.types";

export class NotFoundError extends Error {
  status = 404;
  
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

function serializeMetricsByCountry(metrics: SalaryMetricsByCountry): SalaryMetricsByCountry {
  return {
    ...metrics,
    minimum_salary: metrics.minimum_salary / 100,
    maximum_salary: metrics.maximum_salary / 100,
    average_salary: Math.round((metrics.average_salary / 100) * 100) / 100,
  };
}

function serializeMetricsByJobTitle(metrics: SalaryMetricsByJobTitle): SalaryMetricsByJobTitle {
  return {
    ...metrics,
    average_salary: Math.round((metrics.average_salary / 100) * 100) / 100,
  };
}

export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  getAllEmployees(page: number = 1, limit: number = 20): { data: Employee[]; total: number; page: number; limit: number; totalPages: number } {
    const result = this.repository.findAll(page, limit);
    return {
      ...result,
      data: result.data.map(serializeEmployee),
    };
  }

  getEmployeeById(id: number): Employee {
    const employee = this.repository.findById(id);

    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    return serializeEmployee(employee);
  }

  createEmployee(data: CreateEmployeeDTO): Employee {
    const employee = this.repository.create(data);
    return serializeEmployee(employee);
  }

  updateEmployee(id: number, data: UpdateEmployeeDTO): Employee {
    const employee = this.repository.update(id, data);

    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    return serializeEmployee(employee);
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
      throw new NotFoundError(`No employees found in country: ${country}`);
    }

    return serializeMetricsByCountry(metrics);
  }

  getAverageSalaryByJobTitle(jobTitle: string): SalaryMetricsByJobTitle {
    const metrics = this.repository.findAverageSalaryByJobTitle(jobTitle);

    if (!metrics) {
      throw new NotFoundError(
        `No employees found with job title: ${jobTitle}`
      );
    }

    return serializeMetricsByJobTitle(metrics);
  }
}