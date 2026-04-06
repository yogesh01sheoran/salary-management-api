import { getDatabase } from "../../database/connection";
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SalaryMetricsByCountry,
  SalaryMetricsByJobTitle,
} from "./employee.types";

export class EmployeeRepository {
  findAll(): Employee[] {
    const db = getDatabase();
    return db
      .prepare("SELECT * FROM employees ORDER BY created_at DESC")
      .all() as Employee[];
  }

  findById(id: number): Employee | undefined {
    const db = getDatabase();
    return db
      .prepare("SELECT * FROM employees WHERE id = ?")
      .get(id) as Employee | undefined;
  }

  create(data: CreateEmployeeDTO): Employee {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO employees (full_name, job_title, country, salary)
      VALUES (@full_name, @job_title, @country, @salary)
    `);

    const result = stmt.run(data);
    return this.findById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: UpdateEmployeeDTO): Employee | undefined {
    const db = getDatabase();

    const existing = this.findById(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data };

    db.prepare(`
      UPDATE employees 
      SET full_name = @full_name,
          job_title = @job_title,
          country = @country,
          salary = @salary,
          updated_at = datetime('now')
      WHERE id = @id
    `).run({ ...updated, id });

    return this.findById(id);
  }

  delete(id: number): boolean {
    const db = getDatabase();
    const result = db
      .prepare("DELETE FROM employees WHERE id = ?")
      .run(id);
    return result.changes > 0;
  }

  findMetricsByCountry(country: string): SalaryMetricsByCountry | undefined {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT 
        country,
        MIN(salary) as minimum_salary,
        MAX(salary) as maximum_salary,
        AVG(salary) as average_salary,
        COUNT(*) as employee_count
      FROM employees
      WHERE LOWER(country) = LOWER(?)
      GROUP BY country
    `).get(country) as SalaryMetricsByCountry | undefined;

    return result;
  }

  findAverageSalaryByJobTitle(
    jobTitle: string
  ): SalaryMetricsByJobTitle | undefined {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT 
        job_title,
        AVG(salary) as average_salary,
        COUNT(*) as employee_count
      FROM employees
      WHERE LOWER(job_title) = LOWER(?)
      GROUP BY job_title
    `).get(jobTitle) as SalaryMetricsByJobTitle | undefined;

    return result;
  }
}