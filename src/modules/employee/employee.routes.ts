import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  getSalaryCalculation,
  patchEmployee,
  updateEmployee,
} from "./employee.controller";

const router = Router();

router.get("/", getAllEmployees);
router.get("/:id/salary-calculation", getSalaryCalculation);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.patch("/:id", patchEmployee);
router.delete("/:id", deleteEmployee);

export default router;