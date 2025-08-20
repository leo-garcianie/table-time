import express from 'express';

import { Reservation } from "../models/reservation.model.js";
import { Table } from '../models/table.model.js';
import { User } from '../models/user.model.js';

import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get Stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        )
            .toISOString()
            .split('T')[0];

        const stats = {
            totalReservations: await Reservation.countDocuments({
                status: 'confirmed',
            }),
            todayReservations: await Reservation.countDocuments({
                date: today,
                status: 'confirmed',
            }),
            monthlyReservations: await Reservation.countDocuments({
                date: { $gte: startOfMonth },
                status: 'confirmed',
            }),
            cancelledReservations: await Reservation.countDocuments({
                status: 'cancelled',
            }),
            totalTables: await Table.countDocuments({ isActive: true }),
            totalUsers: await User.countDocuments({
                isActive: true,
                role: 'customer',
            }),
        };

        // Reservations in last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const count = await Reservation.countDocuments({
                date: dateStr,
                status: 'confirmed',
            });

            last7Days.push({
                date: dateStr,
                count,
            });
        }

        stats.weeklyTrend = last7Days;

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
