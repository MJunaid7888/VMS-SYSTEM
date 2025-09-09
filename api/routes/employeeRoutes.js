import express from "express";
import { authenticate, protect } from "../middleware/authMiddleware.js";
import {
  getEmployees,
  getEmployeeById,
} from "../controllers/employeeController.js";

const router = express.Router();

router.use(authenticate);

// GET /employees
router.get("/", protect, getEmployees);

// GET /employees/:id
router.get("/:id", protect, getEmployeeById);

export default router;
