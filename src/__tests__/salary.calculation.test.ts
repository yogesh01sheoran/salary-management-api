import request from "supertest";
import app from "../app";
import { getDatabase } from "../database/connection";

describe("Salary Calculation API", () => {
  let indiaEmployeeId: number;
  let usEmployeeId: number;
  let germanyEmployeeId: number;

  beforeEach(() => {
    const db = getDatabase();
    db.exec("DELETE FROM employees");

    const insert = db.prepare(
      "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
    );

    indiaEmployeeId = insert.run(
      "Raj Kumar",
      "Software Engineer",
      "India",
      100000
    ).lastInsertRowid as number;

    usEmployeeId = insert.run(
      "John Smith",
      "Product Manager",
      "United States",
      150000
    ).lastInsertRowid as number;

    germanyEmployeeId = insert.run(
      "Hans Mueller",
      "Designer",
      "Germany",
      90000
    ).lastInsertRowid as number;
  });

  describe("GET /api/employees/:id/salary-calculation", () => {
    it("should apply 10% TDS for India employee", async () => {
      const response = await request(app)
        .get(`/api/employees/${indiaEmployeeId}/salary-calculation`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        employee_id: indiaEmployeeId,
        full_name: "Raj Kumar",
        country: "India",
        gross_salary: 100000,
        deductions: {
          tds: 10000,
          total: 10000,
        },
        net_salary: 90000,
      });
    });

    it("should apply 12% TDS for United States employee", async () => {
      const response = await request(app)
        .get(`/api/employees/${usEmployeeId}/salary-calculation`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        employee_id: usEmployeeId,
        country: "United States",
        gross_salary: 150000,
        deductions: {
          tds: 18000,
          total: 18000,
        },
        net_salary: 132000,
      });
    });

    it("should apply no deductions for other countries", async () => {
      const response = await request(app)
        .get(`/api/employees/${germanyEmployeeId}/salary-calculation`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        employee_id: germanyEmployeeId,
        country: "Germany",
        gross_salary: 90000,
        deductions: {
          tds: 0,
          total: 0,
        },
        net_salary: 90000,
      });
    });

    it("should return 404 for non-existent employee", async () => {
      const response = await request(app)
        .get("/api/employees/99999/salary-calculation")
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 for invalid employee ID", async () => {
      const response = await request(app)
        .get("/api/employees/abc/salary-calculation")
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should handle decimal salary calculations accurately", async () => {
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
        )
        .run("Decimal User", "Engineer", "India", 75500);

      const response = await request(app)
        .get(`/api/employees/${result.lastInsertRowid}/salary-calculation`)
        .expect(200);

      expect(response.body.data.deductions.tds).toBeCloseTo(7550, 2);
      expect(response.body.data.net_salary).toBeCloseTo(67950, 2);
    });
  });
});