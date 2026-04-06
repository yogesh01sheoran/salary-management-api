import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim(),
  job_title: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must not exceed 100 characters")
    .trim(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must not exceed 100 characters")
    .trim(),
  salary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be a positive number")
    .finite("Salary must be a finite number"),
});

export const UpdateEmployeeSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim()
    .optional(),
  job_title: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must not exceed 100 characters")
    .trim()
    .optional(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must not exceed 100 characters")
    .trim()
    .optional(),
  salary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be a positive number")
    .finite("Salary must be a finite number")
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided for update"
);

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;