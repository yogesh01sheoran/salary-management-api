# Salary Management API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-86.83%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-41%2F41-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-green)

A production-ready RESTful API for comprehensive employee and salary management. This service enables CRUD operations on employee records, calculates net salaries based on country-specific tax rules, and provides detailed salary metrics and analytics.

## 🎯 Features

- **Employee Management** - Create, read, update, and delete employee records
- **Salary Calculations** - Automatic net salary computation with country-specific deduction rules
- **Salary Metrics** - Aggregate salary statistics by country and job title
- **Type-Safe** - Full TypeScript support with strict type checking
- **Data Validation** - Zod schema validation for all inputs
- **Comprehensive Testing** - 41 tests with 86.83% code coverage (4 test suites)
- **Database** - SQLite with WAL mode and foreign key constraints
- **Error Handling** - Standardized error responses across all endpoints
- **Auto-Directory Creation** - Database directory auto-created on startup

## 📋 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 4.22.1 |
| **Language** | TypeScript | 5.9.3 |
| **Database** | SQLite3 (`better-sqlite3`) | 11.10.0 |
| **Validation** | Zod | 3.25.76 |
| **Testing** | Jest | 29.7.0 |
| **Dev Tools** | Nodemon, ts-node | Latest |

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
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

3. **Verify installation**
   ```bash
   npm run build  # Should complete without errors
   npm run test   # Should show 41/41 tests passing
   ```

### Running the Application

**Development Mode** (auto-reload on file changes)
```bash
npm run dev
```
Server runs on `http://localhost:3000`

**Production Mode**
```bash
npm run build
npm start
```

**Troubleshooting Server Start**

If you get `EADDRINUSE: address already in use :::3000`:
```bash
# Kill all Node processes (Windows PowerShell)
taskkill /IM node.exe /F

# Kill all Node processes (macOS/Linux)
pkill -f node

# Then restart
npm run dev
```

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with debug info
npm run test:debug
```

## 📁 Project Structure

```
salary-management-api/
├── src/
│   ├── app.ts                        # Express app setup & middleware config
│   ├── server.ts                     # Server entry point (port config)
│   ├── config/
│   │   └── database.config.ts        # Database path configuration
│   ├── database/
│   │   ├── connection.ts             # Database connection (auto-creates dir)
│   │   └── migrations.ts             # Database schema & indexes
│   ├── middleware/
│   │   └── errorHandler.ts           # Global error handler middleware
│   ├── modules/
│   │   └── employee/
│   │       ├── employee.controller.ts    # HTTP request handlers
│   │       ├── employee.service.ts       # Business logic layer
│   │       ├── employee.repository.ts    # Data access layer
│   │       ├── employee.routes.ts        # Route definitions
│   │       ├── employee.validator.ts     # Zod validation schemas
│   │       ├── employee.types.ts         # TypeScript interfaces
│   │       └── salary.metrics.routes.ts  # Metrics endpoints
│   ├── utils/
│   │   └── salary.calculator.ts      # Salary deduction calculations
│   └── __tests__/
│       ├── setup.ts                  # Jest configuration & DB setup
│       ├── employee.crud.test.ts     # CRUD operation tests
│       ├── salary.calculation.test.ts # Salary calc integration tests
│       ├── salary.calculator.unit.test.ts # Unit tests
│       └── salary.metrics.test.ts    # Metrics endpoint tests
├── dist/                             # Compiled JS (generated)
├── coverage/                         # Coverage reports (generated)
├── data/                             # Database file (auto-created)
├── .env                              # Environment variables
├── jest.config.ts                    # Jest configuration
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.build.json               # Build-specific TS config
├── package.json                      # Dependencies & scripts
└── README.md                         # This file
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /health
```
**Response (200 OK):**
```json
{"success": true, "message": "Salary Management API is running"}
```

### Employee CRUD Endpoints

#### List All Employees
```
GET /api/employees
```
**Response:**
```json
{
  "success": true,
  "data": [{
    "id": 1,
    "full_name": "John Doe",
    "job_title": "Senior Engineer",
    "country": "India",
    "salary": 100000,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }]
}
```

#### Get Employee by ID
```
GET /api/employees/:id
```
**Parameters:** `id` (positive integer, required)

**Response (200):**
```json
{
  "success": true,
  "data": {"id": 1, "full_name": "John Doe", ...}
}
```

**Error (404):**
```json
{"success": false, "message": "Employee with ID 999 not found"}
```

#### Create Employee
```
POST /api/employees
```
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
- `full_name`: string, 2+ chars, required
- `job_title`: string, 2+ chars, required
- `country`: string, 2+ chars, required
- `salary`: number, >0, required

**Response (201 Created):**
```json
{"success": true, "data": {"id": 2, "full_name": "Jane Smith", ...}}
```

#### Update Employee (PUT - All fields required)
```
PUT /api/employees/:id
```
**Request Body:** Same as POST (all 4 fields required)

**Response (200):**
```json
{"success": true, "data": {"id": 2, "full_name": "Jane Smith Updated", ...}}
```

#### Partial Update (PATCH - At least 1 field required)
```
PATCH /api/employees/:id
```
**Request Body (example):**
```json
{"salary": 140000}
```

**Response (200):**
```json
{"success": true, "data": {"id": 2, "salary": 140000, ...}}
```

#### Delete Employee
```
DELETE /api/employees/:id
```
**Response (200):**
```json
{"success": true, "message": "Employee 2 deleted successfully"}
```

### Salary Calculation
```
GET /api/employees/:id/salary-calculation
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "full_name": "John Doe",
    "country": "India",
    "gross_salary": 100000,
    "deductions": {"tds": 10000, "total": 10000},
    "net_salary": 90000
  }
}
```

### Salary Metrics
```
GET /api/salary-metrics/country/:country
```
**Response (200):**
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

```
GET /api/salary-metrics/job-title/:jobTitle
```
**Response (200):**
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

## 🧪 Testing & Coverage

### Current Coverage
```
Statements   : 86.83%
Branches     : 70.58%
Functions    : 88.88%
Lines        : 86.77%

Test Suites: 4 passed, 4 total
Tests:       41 passed, 41 total
```

### Coverage by Module
| Module | Statements | Branches | Functions | Status |
|--------|-----------|----------|-----------|--------|
| **salary.calculator.ts** | 100% | 100% | 100% | ✅ Perfect |
| **employee.repository.ts** | 100% | 100% | 100% | ✅ Perfect |
| **employee.service.ts** | 100% | 100% | 100% | ✅ Perfect |
| **employee.validator.ts** | 100% | 100% | 100% | ✅ Perfect |
| **employee.routes.ts** | 100% | 100% | 100% | ✅ Perfect |
| **migrations.ts** | 100% | 100% | 100% | ✅ Perfect |
| **database.config.ts** | 100% | 100% | 100% | ✅ Perfect |
| **employee.controller.ts** | 79.31% | 65% | 100% | ⚠️ Needs tests |
| **connection.ts** | 82.6% | 50% | 66.66% | ⚠️ Needs tests |
| **errorHandler.ts** | 33.33% | 100% | 0% | ⚠️ Needs tests |
| **app.ts** | 87.5% | 100% | 0% | ⚠️ Partial |

### Run Tests
```bash
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

## 💰 Tax Deduction Rules

| Country | Rate | Example |
|---------|------|---------|
| India | 10% TDS | ₹100,000 → ₹10,000 deduction |
| United States | 12% | $100,000 → $12,000 deduction |
| Other | 0% | No deduction |

**To add countries:** Edit `DEDUCTION_RULES` in [src/utils/salary.calculator.ts](src/utils/salary.calculator.ts)

## 🗄️ Database

### Schema
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

CREATE INDEX idx_employees_country ON employees(country);
CREATE INDEX idx_employees_job_title ON employees(job_title);
```

### Configuration
- **Location**: `./data/salary_management.db`
- **Mode**: WAL (Write-Ahead Logging for concurrency)
- **Features**: Foreign keys enabled, automatic timestamps
- **Note**: Directory auto-created on startup

## 🔍 Deep Analysis & Debug Guide

### Build & Compilation

**Check TypeScript errors:**
```bash
npm run build
```
Should complete without errors.

**Strict Mode:** TypeScript strict mode is enabled
```json
"strict": true
```

### Runtime Issues

**Port Already in Use (EADDRINUSE)**
```bash
# Windows
taskkill /IM node.exe /F

# macOS/Linux
pkill -f node
```

**Database Directory Not Found**
- ✅ **Fixed**: Connection.ts now auto-creates `./data/` directory
- Uses `fs.mkdirSync(dir, { recursive: true })`

**JSON Parse Errors**
- All POST/PUT/PATCH requests require `Content-Type: application/json`
- Zod validates schema before processing

### Performance Considerations

1. **Database Indexes**: Configured on country and job_title
2. **WAL Mode**: Improves concurrent read/write performance
3. **Query Optimization**: All queries use indexed columns
4. **Memory**: Tests use in-memory DB for speed

### Security Best Practices

✅ **Input Validation**: All inputs validated with Zod schemas  
✅ **Type Safety**: Full TypeScript strict mode  
✅ **Error Handling**: Standardized error responses  
✅ **SQL Injection**: Better-sqlite3 uses parameterized queries  
✅ **CORS**: Can be configured in middleware  

**Recommendations:**
- Add rate limiting middleware (express-rate-limit)
- Implement authentication/authorization
- Add request logging (morgan)
- Use helmet for security headers
- Add API versioning

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| EADDRINUSE | Port 3000 in use | `taskkill /IM node.exe /F` |
| Database not found | Missing data/ dir | Restart server (auto-creates) |
| Validation errors | Invalid JSON | Check Content-Type header |
| 404 on routes | Typo in URL | Verify endpoint path |
| Test timeout | Slow DB | Run `npm run test:coverage` |

## 📝 Architecture

### Layered Architecture
```
┌─────────────────────┐
│   HTTP Requests     │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│    Routes           │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Controllers       │ (HTTP handling)
├─────────────────────┤
│   Validation        │ (Zod schemas)
├─────────────────────┤
│   Services          │ (Business logic)
├─────────────────────┤
│   Repository        │ (Data access)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   SQLite Database   │
└─────────────────────┘
```

### Design Patterns Used

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Dependency Injection**: Service dependencies
- **Middleware Chain**: Error & request handling
- **Type Guards**: Runtime type validation

## 🚨 Error Handling

### Response Format

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {"salary": ["Salary must be a positive number"]}
}
```

**Not Found (404):**
```json
{"success": false, "message": "Employee with ID 999 not found"}
```

**Server Error (500):**
```json
{"success": false, "message": "Internal server error"}
```

**Note:** Error details logged to console but not exposed to clients

## 📦 Build & Deployment

**Build for production:**
```bash
npm run build
```

**Files generated:**
- `dist/` - Compiled JavaScript
- Coverage reports optional

**Run production:**
```bash
npm start
```

**Docker consideration:**
Would need:
- Dockerfile with Node 18 base
- .dockerignore file
- Port exposure configuration

## 🔧 Configuration

### Environment Variables (.env)
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # environment: development|production|test
```

### Database Paths
- **Development**: `./data/salary_management.db`
- **Test**: `:memory:` (in-memory)
- **Production**: `./data/salary_management.db`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Run tests: `npm run test:watch`
4. Commit changes: `git commit -m 'feat: add new feature'`
5. Push branch: `git push origin feature/new-feature`
6. Open Pull Request

### Code Standards
- Use TypeScript for all code
- Match existing code style
- Add tests for new features
- Ensure tests pass: `npm run test`
- Update README as needed

### Future Improvements
- Increase coverage: ErrorHandler & Controller tests
- Add rate limiting
- Implement pagination
- Add request logging
- Implement caching
- Add API versioning
- Database transaction support

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Yogesh Sheoran**
- GitHub: [@yogesh01sheoran](https://github.com/yogesh01sheoran)
- Repository: [salary-management-api](https://github.com/yogesh01sheoran/salary-management-api)

## 🙋 Support

For issues or questions:
- Open an issue: [GitHub Issues](https://github.com/yogesh01sheoran/salary-management-api/issues)
- Check test files for usage examples
- Review documentation above

## 🔗 Useful Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation Library](https://zod.dev)
- [Jest Testing Framework](https://jestjs.io)
- [Better SQLite3 Guide](https://github.com/WiseLibs/better-sqlite3/wiki)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📊 Project Health Dashboard

```
✅ Build Status       : PASSING
✅ Test Status        : 41/41 PASSING
✅ Coverage           : 86.83%
✅ TypeScript         : STRICT MODE
✅ Dependencies       : UP TO DATE
✅ Documentation      : COMPREHENSIVE
⚠️  Error Handler     : Low Coverage (needs tests)
⚠️  Database Tests    : Partial Coverage (needs edge cases)
```

---

**Last Updated:** April 6, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Maintainer:** Yogesh Sheoran

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