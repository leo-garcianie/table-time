import express from "express";
import { validationResult } from "express-validator";

import { Table } from "../models/table.model.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import { tableValidators } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Get all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).sort({ id: 1 });
    res.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create table (admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  tableValidators,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const table = new Table(req.body);
      await table.save();

      res.status(201).json({
        message: "Table created",
        table,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Table with ID already created" });
      }
      console.error("Error creating table:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);
export default router;
