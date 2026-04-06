# Salary Management API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-86.83%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-41%2F41-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)

A production-ready RESTful API for comprehensive employee and salary management with CRUD operations, automatic salary calculations, and detailed salary metrics.

## 🎯 Features

- **Employee Management** - Create, read, update, delete employee records
- **Salary Calculations** - Automatic net salary with country-specific tax rules
- **Salary Metrics** - Aggregate statistics by country and job title
- **Type-Safe** - Full TypeScript with strict type checking
- **Data Validation** - Zod schema validation for all inputs
- **Comprehensive Testing** - 41/41 tests, 86.83% code coverage
- **Security** - Helmet, CORS, rate limiting included
- **Error Handling** - Standardized error responses
- **Database** - SQLite with WAL mode & auto-directory creation

## 📋 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 4.22.1 |
| **Language** | TypeScript | 5.9.3 |
| **Database** | SQLite3 (better-sqlite3) | 11.10.0 |
| **Validation** | Zod | 3.25.76 |
| **Testing** | Jest & Supertest | 29.7.0 |
| **Security** | Helmet, CORS, Rate Limit | Latest |

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ and npm v9+

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yogesh01sheoran/salary-management-api.git
   cd salary-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build & verify**
   ```bash
   npm run build   # No TypeScript errors
   npm run test    # 41/41 tests passing
   ```

### Running the Application

**Development** (auto-reload on file changes):
```bash
npm run dev
```

**Production** (compiled):
```bash
npm run build
npm start
```

Both run on `http://localhost:3000`

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

## 📁 Project Structure

```
salary-management-api/
├── src/
│   ├── app.ts                        # Express app & middleware
│   ├── server.ts                     # Server entry point
│   ├── config/
│   │   └── database.config.ts        # Database configuration
│   ├── database/
│   │   ├── connection.ts             # SQLite connection
│   │   └── migrations.ts             # Schema & indexes
│   ├── middleware/
│   │   └── errorHandler.ts           # Global error handler
│   ├── modules/employee/
│   │   ├── employee.controller.ts    # HTTP handlers
│   │   ├── employee.service.ts       # Business logic
│   │   ├── employee.repository.ts    # Data access
│   │   ├── employee.routes.ts        # Route definitions
│   │   ├── employee.validator.ts     # Zod schemas
│   │   ├── employee.types.ts         # TypeScript interfaces
│   │   └── salary.metrics.routes.ts  # Metrics endpoints
│   ├── utils/
│   │   └── salary.calculator.ts      # Tax calculations
│   └── __tests__/                    # Test files (4 suites)
├── dist/                             # Compiled output
├── coverage/                         # Coverage reports
├── data/                             # SQLite database
├── jest.config.ts                    # Jest configuration
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000`

### Health Check
```http
GET /health
```

### Employee CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee (all fields) |
| PATCH | `/api/employees/:id` | Partial update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Salary Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/:id/salary-calculation` | Calculate net salary with deductions |
| GET | `/api/salary-metrics/country` | Metrics grouped by country |
| GET | `/api/salary-metrics/job-title` | Metrics grouped by job title |

### Create Employee Example

**Request:**
```json
{
  "full_name": "John Doe",
  "job_title": "Senior Engineer",
  "country": "India",
  "salary": 100000
}
```

**Validation:**
- `full_name`: string, min 2 chars
- `job_title`: string, min 2 chars
- `country`: string, max 60 chars
- `salary`: number, must be > 0

**Response (201):**
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

### Salary Calculation Response

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

### Error Response

```json
{
  "success": false,
  "message": "Validation failed or resource not found"
}
```

## 🧪 Testing & Coverage

### Coverage Report

```
Statements   : 86.83%
Branches     : 70.58%
Functions    : 88.88%
Lines        : 86.77%

Test Suites: 4 passed, 4 total
Tests:       41 passed, 41 total
```

### Test Files

- `employee.crud.test.ts` - CRUD operations (8 tests)
- `salary.calculation.test.ts` - Salary calculations (9 tests)
- `salary.calculator.unit.test.ts` - Unit tests for calculator (6 tests)
- `salary.metrics.test.ts` - Metrics endpoints (18 tests)

## 💰 Tax Deduction Rules

| Country | Rate |
|---------|------|
| India | 10% TDS |
| United States | 12% |
| Other | 0% |

To add more countries, edit `DEDUCTION_RULES` in `src/utils/salary.calculator.ts`

## 🗄️ Database

### Schema

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  country TEXT NOT NULL,
  salary INTEGER NOT NULL CHECK(salary > 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_employees_country ON employees(LOWER(country));
CREATE INDEX idx_employees_job_title ON employees(LOWER(job_title));
```

### Configuration

- **Type:** SQLite3 with better-sqlite3 driver
- **Location:** `./data/salary_management.db` (auto-created)
- **Mode:** WAL (Write-Ahead Logging)
- **Salary Storage:** INTEGER (stored as cents for precision)
- **Features:** Foreign keys enabled, automatic timestamps

## 🔍 Troubleshooting

### Port Already in Use (EADDRINUSE)

```bash
# Windows
taskkill /IM node.exe /F

# macOS/Linux
pkill -f node
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Database not found | Restart server (auto-creates `./data/` directory) |
| Validation errors | Ensure `Content-Type: application/json` header |
| 404 on routes | Verify endpoint path is correct |
| Test timeout | Run `npm run test` without other processes |

## 🏗️ Architecture

### Layered Design

```
HTTP Requests
     ↓
  Routes
     ↓
 Controllers (HTTP handling)
     ↓
 Validation (Zod schemas)
     ↓
Services (Business logic)
     ↓
Repository (Data access)
     ↓
 SQLite Database
```

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **Middleware Chain** - Request/error handling
- **Type Guards** - Runtime type validation

## 🔒 Security Features

✅ Input validation with Zod schemas  
✅ Full TypeScript strict mode  
✅ SQL injection protection (parameterized queries)  
✅ Helmet security headers  
✅ CORS protection  
✅ Rate limiting (15 min window, 100 req/IP)  
✅ Graceful error handling  
✅ Standardized error responses

## 📦 Build & Deployment

**Build for production:**
```bash
npm run build
```

**Run production:**
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'feat: add feature'`)
4. Push branch (`git push origin feature/new-feature`)
5. Open Pull Request

### Code Standards
- Use TypeScript for all code
- Match existing code style
- Add tests for new features
- Ensure tests pass: `npm run test`
- Update README as needed

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Yogesh Sheoran**

- GitHub: [@yogesh01sheoran](https://github.com/yogesh01sheoran)
- Repository: [salary-management-api](https://github.com/yogesh01sheoran/salary-management-api)

## 🙋 Support

For issues or questions:
- Open issue: [GitHub Issues](https://github.com/yogesh01sheoran/salary-management-api/issues)
- Check test files for usage examples
- Review documentation above

## 📚 Useful Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation Library](https://zod.dev)
- [Jest Testing Framework](https://jestjs.io)
- [Better SQLite3 Guide](https://github.com/WiseLibs/better-sqlite3/wiki)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated:** April 6, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
