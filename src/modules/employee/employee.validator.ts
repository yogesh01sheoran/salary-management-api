import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(100, "Full name must be 100 characters or less"),
  job_title: z.string().trim().min(2, "Job title is required").max(100, "Job title must be 100 characters or less"),
  country: z.string().trim().min(2, "Country is required").max(60, "Country must be 60 characters or less"),
  salary: z.number().positive("Salary must be a positive number").transform(val => Math.round(val * 100)),
});

export const UpdateEmployeeSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name is required").max(100, "Full name must be 100 characters or less").optional(),
    job_title: z.string().trim().min(2, "Job title is required").max(100, "Job title must be 100 characters or less").optional(),
    country: z.string().trim().min(2, "Country is required").max(60, "Country must be 60 characters or less").optional(),
    salary: z.number().positive("Salary must be a positive number").transform(val => Math.round(val * 100)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;