import express from 'express';
import { User } from '../models/user.model.js';

import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all users (admin)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { role, isActive, limit = 100 } = req.query;
        const filter = {};

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Change user state (admin)
router.patch(
    '/users/:id/status',
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { isActive } = req.body;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { isActive },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                message: `User ${
                    isActive ? 'activated' : 'deactivated'
                } successfully`,
                user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

export default router;
