import request from "supertest";
import app from "../app";
import { getDatabase } from "../database/connection";

describe("Employee CRUD API", () => {
  beforeEach(() => {
    const db = getDatabase();
    db.exec("DELETE FROM employees");
  });

  describe("POST /api/employees", () => {
    it("should create a new employee with valid data", async () => {
      const payload = {
        full_name: "Alice Johnson",
        job_title: "Software Engineer",
        country: "India",
        salary: 80000,
      };

      const response = await request(app)
        .post("/api/employees")
        .send(payload)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(payload);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.created_at).toBeDefined();
      expect(response.body.data.updated_at).toBeDefined();
    });

    it("should return 400 when full_name is missing", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          job_title: "Engineer",
          country: "India",
          salary: 50000,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 400 when job_title is missing", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          full_name: "Bob",
          country: "India",
          salary: 50000,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 when country is missing", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          full_name: "Bob",
          job_title: "Engineer",
          salary: 50000,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 when salary is missing", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          full_name: "Bob",
          job_title: "Engineer",
          country: "India",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 when salary is negative", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          full_name: "Bob",
          job_title: "Engineer",
          country: "India",
          salary: -5000,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 when salary is zero", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          full_name: "Bob",
          job_title: "Engineer",
          country: "India",
          salary: 0,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 when salary is not a number", async () => {
      const response = await request(app)
        .post("/api/employees")
        .send({
          full_name: "Bob",
          job_title: "Engineer",
          country: "India",
          salary: "abc",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/employees", () => {
    it("should return empty array when no employees exist", async () => {
      const response = await request(app).get("/api/employees").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("should return all employees", async () => {
      const db = getDatabase();

      db.exec(`
        INSERT INTO employees (full_name, job_title, country, salary)
        VALUES 
          ('Alice', 'Engineer', 'India', 80000),
          ('Bob', 'Manager', 'United States', 120000)
      `);

      const response = await request(app).get("/api/employees").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe("GET /api/employees/:id", () => {
    it("should return an employee by ID", async () => {
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
        )
        .run("Alice", "Engineer", "India", 80000);

      const response = await request(app)
        .get(`/api/employees/${result.lastInsertRowid}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.full_name).toBe("Alice");
    });

    it("should return 404 for non-existent employee", async () => {
      const response = await request(app)
        .get("/api/employees/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app)
        .get("/api/employees/abc")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/employees/:id", () => {
    it("should update an employee fully", async () => {
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
        )
        .run("Alice", "Engineer", "India", 80000);

      const response = await request(app)
        .put(`/api/employees/${result.lastInsertRowid}`)
        .send({
          full_name: "Alice Updated",
          job_title: "Senior Engineer",
          country: "United States",
          salary: 120000,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.full_name).toBe("Alice Updated");
      expect(response.body.data.salary).toBe(120000);
    });

    it("should return 404 when updating non-existent employee", async () => {
      const response = await request(app)
        .put("/api/employees/99999")
        .send({
          full_name: "Ghost",
          job_title: "Nobody",
          country: "Nowhere",
          salary: 1000,
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PATCH /api/employees/:id", () => {
    it("should partially update an employee salary", async () => {
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
        )
        .run("Alice", "Engineer", "India", 80000);

      const response = await request(app)
        .patch(`/api/employees/${result.lastInsertRowid}`)
        .send({ salary: 95000 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.salary).toBe(95000);
      expect(response.body.data.full_name).toBe("Alice");
    });

    it("should return 400 when patch body is empty", async () => {
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
        )
        .run("Alice", "Engineer", "India", 80000);

      const response = await request(app)
        .patch(`/api/employees/${result.lastInsertRowid}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/employees/:id", () => {
    it("should delete an existing employee", async () => {
      const db = getDatabase();
      const result = db
        .prepare(
          "INSERT INTO employees (full_name, job_title, country, salary) VALUES (?, ?, ?, ?)"
        )
        .run("Alice", "Engineer", "India", 80000);

      const response = await request(app)
        .delete(`/api/employees/${result.lastInsertRowid}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/deleted/i);
    });

    it("should return 404 when deleting non-existent employee", async () => {
      const response = await request(app)
        .delete("/api/employees/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});