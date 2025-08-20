import express from "express";
import { validationResult } from "express-validator";

import { Reservation } from "../models/reservation.model.js";
import { Table } from "../models/table.model.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { reservationValidators } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Get reservations
router.get("/", async (req, res) => {
    try {
        const { date, status, email } = req.query;
        const filter = {};

        if (date) filter.date = date;
        if (status) filter.status = status;
        if (email) filter["customer.email"] = new RegExp(email, "i");

        const reservations = await Reservation.find(filter)
            .populate("userId", "name email")
            .sort({ date: 1, time: 1 });

        res.json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create reservation
router.post("/", reservationValidators, authMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { tableId, date, time, partySize, customer, notes } = req.body;


        // Check if the table exists and is active
        const table = await Table.findOne({ id: tableId, isActive: true });
        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }

        // Check the party size
        if (table.capacity < partySize) {
            return res.status(400).json({ error: "The table has already capacity" });
        }

        // Check availability
        const existingReservation = await Reservation.findOne({
            tableId,
            date,
            time,
            status: { $in: ["confirmed", "pending"] },
        });

        if (existingReservation) {
            return res.status(409).json({ error: "Table not available" });
        }

        // Create reservation
        const reservation = new Reservation({
            tableId,
            date,
            time,
            partySize,
            customer,
            notes,
            userId: req.user._id,
        });

        await reservation.save();

        res.status(201).json({
            message: "Reservation successfully created!",
            reservation: {
                ...reservation.toObject(),
                table,
            },
        });
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get reservation by ID
router.get("/:id", async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate(
            "userId",
            "name email",
        );

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        // Get info table
        const table = await Table.findOne({ id: reservation.tableId });

        res.json({
            ...reservation.toObject(),
            table,
        });
    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Cancel reservation
router.patch("/:id/cancel", async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        if (reservation.status === "cancelled") {
            return res
                .status(400)
                .json({ error: "Reservation has already been cancelled" });
        }

        reservation.status = "cancelled";
        reservation.updatedAt = new Date();
        await reservation.save();

        res.json({
            message: "Reservation canceled",
            reservation,
        });
    } catch (error) {
        console.error("Error canceling reservation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get my reservations (auth user)
router.get("/my/reservations", authMiddleware, async (req, res) => {
    try {
        const { status, upcoming } = req.query;
        const filter = { userId: req.user._id };

        if (status) filter.status = status;

        if (upcoming === "true") {
            const today = new Date().toISOString().split("T")[0];
            filter.date = { $gte: today };
            filter.status = { $in: ["confirmed", "pending"] };
        }

        const reservations = await Reservation.find(filter).sort({
            date: 1,
            time: 1,
        });

        // Add table info
        const reservationsWithTables = await Promise.all(
            reservations.map(async (reservation) => {
                const table = await Table.findOne({ id: reservation.tableId });
                return {
                    ...reservation.toObject(),
                    table,
                };
            }),
        );

        res.json(reservationsWithTables);
    } catch (error) {
        console.error("Error fetching my reservations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
