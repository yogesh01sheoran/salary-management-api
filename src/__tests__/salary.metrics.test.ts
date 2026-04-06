import request from "supertest";
import app from "../app";
import { getDatabase } from "../database/connection";

describe("Salary Metrics API", () => {
  beforeEach(() => {
    const db = getDatabase();
    db.exec("DELETE FROM employees");

    db.exec(`
      INSERT INTO employees (full_name, job_title, country, salary) VALUES
        ('Alice Kumar', 'Software Engineer', 'India', 8000000),
        ('Bob Singh', 'Software Engineer', 'India', 9000000),
        ('Carol Patel', 'Product Manager', 'India', 12000000),
        ('David Smith', 'Software Engineer', 'United States', 15000000),
        ('Eve Johnson', 'Product Manager', 'United States', 18000000),
        ('Frank Mueller', 'Designer', 'Germany', 7000000)
    `);
  });

  describe("GET /api/salary-metrics/country/:country", () => {
    it("should return min, max, and average salary for India", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/country/India")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        country: "India",
        minimum_salary: 80000,
        maximum_salary: 120000,
        employee_count: 3,
      });

      expect(response.body.data.average_salary).toBeCloseTo(96666.67, 2);
    });

    it("should return correct metrics for United States", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/country/United States")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        country: "United States",
        minimum_salary: 150000,
        maximum_salary: 180000,
        average_salary: 165000,
        employee_count: 2,
      });
    });

    it("should return correct metrics for a country with one employee", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/country/Germany")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        country: "Germany",
        minimum_salary: 70000,
        maximum_salary: 70000,
        average_salary: 70000,
        employee_count: 1,
      });
    });

    it("should support case-insensitive country lookup", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/country/india")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee_count).toBe(3);
    });

    it("should return 404 for unknown country", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/country/Antarctica")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/salary-metrics/job-title/:jobTitle", () => {
    it("should return average salary for Software Engineer", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/job-title/Software Engineer")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job_title).toBe("Software Engineer");
      expect(response.body.data.employee_count).toBe(3);
      expect(response.body.data.average_salary).toBeCloseTo(106666.67, 2);
    });

    it("should return average salary for Product Manager", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/job-title/Product Manager")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        job_title: "Product Manager",
        average_salary: 150000,
        employee_count: 2,
      });
    });

    it("should return correct data for single-employee job title", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/job-title/Designer")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        job_title: "Designer",
        average_salary: 70000,
        employee_count: 1,
      });
    });

    it("should support case-insensitive job title lookup", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/job-title/software engineer")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee_count).toBe(3);
    });

    it("should return 404 for unknown job title", async () => {
      const response = await request(app)
        .get("/api/salary-metrics/job-title/Astronaut")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});