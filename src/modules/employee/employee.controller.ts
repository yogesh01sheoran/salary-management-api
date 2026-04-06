import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { EmployeeRepository } from "./employee.repository";
import { EmployeeService, NotFoundError } from "./employee.service";
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
} from "./employee.validator";
import { calculateSalary } from "../../utils/salary.calculator";

const service = new EmployeeService(new EmployeeRepository());

type EmployeeIdParams = {
  id: string;
};

type CountryParams = {
  country: string;
};

type JobTitleParams = {
  jobTitle: string;
};

function parseEmployeeId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function formatValidationError(
  error: z.ZodError
): { success: false; message: string; errors?: Record<string, any>; formErrors?: any } {
  const flattened = error.flatten();
  return {
    success: false,
    message: "Validation failed",
    errors: flattened.fieldErrors,
    formErrors: flattened.formErrors,
  };
}

export function getAllEmployees(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const MAX_PAGE_SIZE = 100;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.limit as string) || 20));
    
    const result = service.getAllEmployees(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export function getEmployeeById(
  req: Request<EmployeeIdParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID. ID must be a positive integer.",
      });
      return;
    }

    const employee = service.getEmployeeById(id);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
}

export function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const parsed = CreateEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json(formatValidationError(parsed.error));
      return;
    }

    const employee = service.createEmployee(parsed.data);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
}

export function updateEmployee(
  req: Request<EmployeeIdParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID. ID must be a positive integer.",
      });
      return;
    }

    const parsed = CreateEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json(formatValidationError(parsed.error));
      return;
    }

    const employee = service.updateEmployee(id, parsed.data);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
}

export function patchEmployee(
  req: Request<EmployeeIdParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID. ID must be a positive integer.",
      });
      return;
    }

    const parsed = UpdateEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json(formatValidationError(parsed.error));
      return;
    }

    const employee = service.updateEmployee(id, parsed.data);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
}

export function deleteEmployee(
  req: Request<EmployeeIdParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID. ID must be a positive integer.",
      });
      return;
    }

    service.deleteEmployee(id);

    res.status(200).json({
      success: true,
      message: `Employee ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}

export function getSalaryCalculation(
  req: Request<EmployeeIdParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID. ID must be a positive integer.",
      });
      return;
    }

    const employee = service.getEmployeeById(id);
    const calculation = calculateSalary(employee);

    res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    next(error);
  }
}

export function getSalaryMetricsByCountry(
  req: Request<CountryParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const country = req.params.country?.trim();

    if (!country) {
      res.status(400).json({
        success: false,
        message: "Country parameter is required",
      });
      return;
    }

    const metrics = service.getSalaryMetricsByCountry(country);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
}

export function getSalaryMetricsByJobTitle(
  req: Request<JobTitleParams>,
  res: Response,
  next: NextFunction
): void {
  try {
    const jobTitle = req.params.jobTitle?.trim();

    if (!jobTitle) {
      res.status(400).json({
        success: false,
        message: "Job title parameter is required",
      });
      return;
    }

    const metrics = service.getAverageSalaryByJobTitle(jobTitle);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
}