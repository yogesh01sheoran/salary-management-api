import { getDatabase } from "../../database/connection";
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SalaryMetricsByCountry,
  SalaryMetricsByJobTitle,
} from "./employee.types";

export class EmployeeRepository {
  findAll(page: number = 1, limit: number = 20): { data: Employee[]; total: number; page: number; limit: number; totalPages: number } {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    
    const countResult = db
      .prepare("SELECT COUNT(*) as count FROM employees")
      .get() as { count: number };
    const total = countResult.count;
    
    const data = db
      .prepare("SELECT * FROM employees ORDER BY id ASC LIMIT ? OFFSET ?")
      .all(limit, offset) as Employee[];
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findById(id: number): Employee | undefined {
    const db = getDatabase();
    return db
      .prepare("SELECT * FROM employees WHERE id = ?")
      .get(id) as Employee | undefined;
  }

  create(data: CreateEmployeeDTO): Employee {
    const db = getDatabase();

    const result = db
      .prepare(
        `
        INSERT INTO employees (full_name, job_title, country, salary)
        VALUES (@full_name, @job_title, @country, @salary)
      `
      )
      .run(data);

    const created = this.findById(result.lastInsertRowid as number);
    if (!created) {
      throw new Error('Failed to retrieve employee after insert');
    }
    return created;
  }

  update(id: number, data: UpdateEmployeeDTO): Employee | undefined {
    const db = getDatabase();
    
    const updated = db
      .prepare(
        `
        UPDATE employees
        SET full_name = COALESCE(@full_name, full_name),
            job_title = COALESCE(@job_title, job_title),
            country = COALESCE(@country, country),
            salary = COALESCE(@salary, salary),
            updated_at = datetime('now')
        WHERE id = @id
        RETURNING *
      `
      )
      .get({
        id,
        full_name: data.full_name,
        job_title: data.job_title,
        country: data.country,
        salary: data.salary,
      }) as Employee | undefined;

    return updated;
  }

  delete(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare("DELETE FROM employees WHERE id = ?").run(id);
    return result.changes > 0;
  }

  findMetricsByCountry(country: string): SalaryMetricsByCountry | undefined {
    const db = getDatabase();

    return db
      .prepare(
        `
        SELECT
          MIN(country) AS country,
          MIN(salary) AS minimum_salary,
          MAX(salary) AS maximum_salary,
          ROUND(AVG(salary), 2) AS average_salary,
          COUNT(*) AS employee_count
        FROM employees
        WHERE LOWER(country) = LOWER(?)
        GROUP BY LOWER(country)
      `
      )
      .get(country) as SalaryMetricsByCountry | undefined;
  }

  findAverageSalaryByJobTitle(
    jobTitle: string
  ): SalaryMetricsByJobTitle | undefined {
    const db = getDatabase();

    return db
      .prepare(
        `
        SELECT
          MIN(job_title) AS job_title,
          ROUND(AVG(salary), 2) AS average_salary,
          COUNT(*) AS employee_count
        FROM employees
        WHERE LOWER(job_title) = LOWER(?)
        GROUP BY LOWER(job_title)
      `
      )
      .get(jobTitle) as SalaryMetricsByJobTitle | undefined;
  }
}