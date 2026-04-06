# Salary Management API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-87.76%25-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A production-ready RESTful API for comprehensive employee and salary management. This service enables CRUD operations on employee records, calculates net salaries based on country-specific tax rules, and provides detailed salary metrics and analytics.

## 🎯 Features

- **Employee Management** - Create, read, update, and delete employee records
- **Salary Calculations** - Automatic net salary computation with country-specific deduction rules
- **Salary Metrics** - Aggregate salary statistics by country and job title
- **Type-Safe** - Full TypeScript support with strict type checking
- **Data Validation** - Zod schema validation for all inputs
- **Comprehensive Testing** - 41 tests with 87.76% code coverage
- **Database** - SQLite with WAL mode and foreign key constraints
- **Error Handling** - Standardized error responses across all endpoints

## 📋 Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.x |
| **Language** | TypeScript 5.x |
| **Database** | SQLite3 (`better-sqlite3`) |
| **Validation** | Zod |
| **Testing** | Jest 29.x + Supertest |
| **Tools** | Nodemon, ts-node, rimraf |

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

You can verify your installation:
```bash
node --version  # v18.x.x or higher
npm --version   # v9.x.x or higher
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yogesh01sheoran/salary-management-api.git
   cd salary-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify the installation**
   ```bash
   npm run build
   npm run test
   ```

### Running the Application

**Development Mode** (with auto-reload)
```bash
npm run dev
```
The API will start on `http://localhost:3000`

**Production Mode**
```bash
npm run build
npm start
```

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with debugging information
npm run test:debug
```

## 📁 Project Structure

```
salary-management-api/
├── src/
│   ├── app.ts                      # Express app setup and middleware
│   ├── server.ts                   # Server entry point
│   ├── config/
│   │   └── database.config.ts      # Database configuration
│   ├── database/
│   │   ├── connection.ts           # Database connection management
│   │   └── migrations.ts           # Database schema setup
│   ├── middleware/
│   │   └── errorHandler.ts         # Global error handling middleware
│   ├── modules/
│   │   └── employee/
│   │       ├── employee.controller.ts    # Request handlers
│   │       ├── employee.service.ts       # Business logic
│   │       ├── employee.repository.ts    # Data access layer
│   │       ├── employee.routes.ts        # Route definitions
│   │       ├── employee.validator.ts     # Request validation schemas
│   │       ├── employee.types.ts         # TypeScript interfaces
│   │       └── salary.metrics.routes.ts  # Metrics endpoint routes
│   ├── utils/
│   │   └── salary.calculator.ts    # Salary calculation logic
│   └── __tests__/
│       ├── setup.ts                # Test configuration
│       ├── employee.crud.test.ts   # CRUD operation tests
│       ├── salary.calculation.test.ts # Salary calculation tests
│       ├── salary.calculator.unit.test.ts # Unit tests
│       └── salary.metrics.test.ts  # Metrics endpoint tests
├── dist/                           # Compiled JavaScript output
├── coverage/                       # Test coverage reports
├── jest.config.ts                  # Jest configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.build.json             # Build-specific TS config
├── package.json                    # Project dependencies
└── README.md                       # This file
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```
Returns server status.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Salary Management API is running"
}
```

### Employee Endpoints

#### Get All Employees
```
GET /api/employees
```
Retrieve all employee records.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "John Doe",
      "job_title": "Senior Engineer",
      "country": "India",
      "salary": 100000,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Employee by ID
```
GET /api/employees/:id
```
Retrieve a specific employee by their ID.

**Parameters:**
- `id` (path param, required) - Positive integer

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "job_title": "Senior Engineer",
    "country": "India",
    "salary": 100000,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Employee with ID 999 not found"
}
```

#### Create Employee
```
POST /api/employees
```
Create a new employee record.

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "job_title": "Product Manager",
  "country": "United States",
  "salary": 120000
}
```

**Validation Rules:**
- `full_name`: string, minimum 2 characters, required
- `job_title`: string, minimum 2 characters, required
- `country`: string, minimum 2 characters, required
- `salary`: number, must be positive (>0), required

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "full_name": "Jane Smith",
    "job_title": "Product Manager",
    "country": "United States",
    "salary": 120000,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

#### Update Employee (PUT)
```
PUT /api/employees/:id
```
Update all fields of an employee (all fields required).

**Parameters:**
- `id` (path param, required) - Positive integer

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "job_title": "Senior Product Manager",
  "country": "United States",
  "salary": 130000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "full_name": "Jane Smith",
    "job_title": "Senior Product Manager",
    "country": "United States",
    "salary": 130000,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:30:00Z"
  }
}
```

#### Partial Update Employee (PATCH)
```
PATCH /api/employees/:id
```
Update specific fields of an employee (at least one field required).

**Parameters:**
- `id` (path param, required) - Positive integer

**Request Body (example - update only salary):**
```json
{
  "salary": 140000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "full_name": "Jane Smith",
    "job_title": "Senior Product Manager",
    "country": "United States",
    "salary": 140000,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

#### Delete Employee
```
DELETE /api/employees/:id
```
Delete an employee record.

**Parameters:**
- `id` (path param, required) - Positive integer

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee 2 deleted successfully"
}
```

### Salary Calculation Endpoints

#### Get Salary Calculation
```
GET /api/employees/:id/salary-calculation
```
Calculate net salary with deductions for an employee.

**Parameters:**
- `id` (path param, required) - Positive integer

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "full_name": "John Doe",
    "country": "India",
    "gross_salary": 100000,
    "deductions": {
      "tds": 10000,
      "total": 10000
    },
    "net_salary": 90000
  }
}
```

### Metrics Endpoints

#### Get Salary Metrics by Country
```
GET /api/salary-metrics/country/:country
```
Retrieve salary statistics for employees in a specific country.

**Parameters:**
- `country` (path param, required) - Country name (case-insensitive)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "country": "India",
    "minimum_salary": 50000,
    "maximum_salary": 150000,
    "average_salary": 100000,
    "employee_count": 3
  }
}
```

#### Get Salary Metrics by Job Title
```
GET /api/salary-metrics/job-title/:jobTitle
```
Retrieve salary statistics for employees with a specific job title.

**Parameters:**
- `jobTitle` (path param, required) - Job title (case-insensitive)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "job_title": "Senior Engineer",
    "average_salary": 120000,
    "employee_count": 2
  }
}
```

## 💰 Tax Deduction Rules

The API calculates deductions based on the employee's country:

| Country | Deduction Rate | Example |
|---------|----------------|---------|
| India | 10% (TDS) | ₹100,000 → ₹10,000 deduction |
| United States | 12% | $100,000 → $12,000 deduction |
| Other Countries | 0% | No deduction applied |

To add more countries, modify the `DEDUCTION_RULES` object in [src/utils/salary.calculator.ts](src/utils/salary.calculator.ts).

## 🗄️ Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  country TEXT NOT NULL,
  salary REAL NOT NULL CHECK(salary > 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

**Indexes:**
- `idx_employees_country` - For fast country-based queries
- `idx_employees_job_title` - For fast job title-based queries

## ✅ Testing

The project includes comprehensive test suites covering:
- **Unit Tests** - Salary calculator logic
- **Integration Tests** - CRUD operations and endpoints
- **API Tests** - Metrics endpoints
- **Validation Tests** - Input validation and error handling

**Test Coverage:**
```
Statements   : 87.76%
Branches     : 75.00%
Functions    : 88.88%
Lines        : 87.71%
```

Run tests:
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root (optional):
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment (development|production|test)
```

### Database Configuration
Database configuration is in [src/config/database.config.ts](src/config/database.config.ts):
- **Development**: `./data/salary_management.db`
- **Test**: In-memory database
- **Production**: `./data/salary_management.db`

## 🏗️ Architecture

This project follows a layered architecture pattern:

```
├── Routes (HTTP endpoints)
├── Controllers (Request handling)
├── Services (Business logic)
├── Repository (Data access)
└── Database (SQLite)
```

**Key Principles:**
- Separation of concerns
- Type safety with TypeScript
- Validation at boundaries (Zod schemas)
- Comprehensive error handling
- Database transactions where needed

## 📝 Best Practices Implemented

✅ **Error Handling** - Standardized error responses  
✅ **Validation** - Input validation with Zod schemas  
✅ **Type Safety** - Strict TypeScript configuration  
✅ **Testing** - High test coverage with Jest  
✅ **Code Organization** - Modular, scalable structure  
✅ **Documentation** - Inline comments and README  
✅ **Database Integrity** - Foreign keys and constraints  
✅ **Performance** - Database indexes on common queries  

## 🚨 Error Handling

All error responses follow a consistent format:

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "salary": ["Salary must be a positive number"]
  }
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Employee with ID 999 not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 📦 Build & Deployment

**Build for production:**
```bash
npm run build
```

This creates a `dist/` directory with compiled JavaScript.

**Run production build:**
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for all code
- Follow existing code style
- Add tests for new features
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Yogesh Sheoran**

- GitHub: [@yogesh01sheoran](https://github.com/yogesh01sheoran)

## 🙋 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/yogesh01sheoran/salary-management-api/issues)
- Check existing documentation
- Review test files for usage examples

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev)
- [Jest Testing Framework](https://jestjs.io)
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3)

---

**Last Updated:** April 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅