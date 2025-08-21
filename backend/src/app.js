import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import tableRoutes from "./routes/tables.routes.js";
import reservationRoutes from "./routes/reservations.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { Reservation } from "./models/reservation.model.js";
import { Table } from "./models/table.model.js";

import { TIME_SLOTS } from "./utils/constants.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: "https://table-time-ckcc.onrender.com",
    credentials: true,
}));
app.use(express.json());

app.set("trust proxy", 1);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// Special route
app.get("/api/availability", async (req, res) => {
  try {
    const { date, time, partySize } = req.query;

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    // Get occupied tables for that specific date/time
    const occupiedTables = await Reservation.find({
      date,
      ...(time && { time }),
      status: { $in: ["confirmed", "pending"] },
    }).select("tableId");

    const occupiedTableIds = occupiedTables.map((res) => res.tableId);

    // Get all available tables
    let availableTables = await Table.find({
      isActive: true,
      id: { $nin: occupiedTableIds },
      ...(partySize && { capacity: { $gte: parseInt(partySize) } }),
    });

    // Group by time if there isn't specific time
    if (!time) {
      const availability = {};

      for (const slot of TIME_SLOTS) {
        const slotOccupied = await Reservation.find({
          date,
          time: slot,
          status: { $in: ["confirmed", "pending"] },
        }).select("tableId");

        const slotOccupiedIds = slotOccupied.map((res) => res.tableId);

        availability[slot] = await Table.find({
          isActive: true,
          id: { $nin: slotOccupiedIds },
          ...(partySize && { capacity: { $gte: parseInt(partySize) } }),
        });
      }

      return res.json({ availability });
    }

    res.json({ availableTables });
  } catch (e) {
    console.error("Error verification request", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
