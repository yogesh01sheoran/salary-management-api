import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  job_title: z.string().trim().min(2, "Job title is required"),
  country: z.string().trim().min(2, "Country is required"),
  salary: z.number().positive("Salary must be a positive number"),
});

export const UpdateEmployeeSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name is required").optional(),
    job_title: z.string().trim().min(2, "Job title is required").optional(),
    country: z.string().trim().min(2, "Country is required").optional(),
    salary: z.number().positive("Salary must be a positive number").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;