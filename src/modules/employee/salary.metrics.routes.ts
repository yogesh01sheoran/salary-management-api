import { Router } from "express";
import {
  getSalaryMetricsByCountry,
  getSalaryMetricsByJobTitle,
} from "./employee.controller";

const router = Router();

router.get("/country/:country", getSalaryMetricsByCountry);
router.get("/job-title/:jobTitle", getSalaryMetricsByJobTitle);

export default router;