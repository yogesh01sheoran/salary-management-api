import { Request, Response, NextFunction } from "express";
import { EmployeeRepository } from "./employee.repository";
import { EmployeeService, NotFoundError } from "./employee.service";
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
} from "./employee.validator";

const service = new EmployeeService(new EmployeeRepository());

function parseEmployeeId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export function getAllEmployees(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const employees = service.getAllEmployees();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
}

export function getEmployeeById(
  req: Request,
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
    if (error instanceof NotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }

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
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const employee = service.createEmployee(parsed.data);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
}

export function updateEmployee(
  req: Request,
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
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const employee = service.updateEmployee(id, parsed.data);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }

    next(error);
  }
}

export function patchEmployee(
  req: Request,
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
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const employee = service.updateEmployee(id, parsed.data);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }

    next(error);
  }
}

export function deleteEmployee(
  req: Request,
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
    if (error instanceof NotFoundError) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }

    next(error);
  }
}