/**
 * User Routes - User management and admin operations
 * 
 * Handles user profile management and admin user operations.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/user/all
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            role,
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};
        
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [users, total] = await Promise.all([
            User.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .select('-password'),
            User.countDocuments(query)
        ]);

        // Get role counts for dashboard
        const roleCounts = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    page: parseInt(page),
                    limit: parseInt(limit)
                },
                roleCounts: roleCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

/**
 * @route   GET /api/user/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
});

/**
 * @route   PUT /api/user/:id/role
 * @desc    Update user role (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/role', protect, adminOnly, [
    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { role } = req.body;

        // Prevent admin from demoting themselves
        if (req.params.id === req.user._id.toString() && role === 'user') {
            return res.status(400).json({
                success: false,
                message: 'You cannot demote yourself from admin role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            data: { user }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role'
        });
    }
});

/**
 * @route   PUT /api/user/:id/status
 * @desc    Update user active status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status', protect, adminOnly, [
    body('isActive')
        .isBoolean()
        .withMessage('isActive must be a boolean value')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { isActive } = req.body;

        // Prevent admin from deactivating themselves
        if (req.params.id === req.user._id.toString() && !isActive) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: { user }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status'
        });
    }
});

/**
 * @route   DELETE /api/user/:id
 * @desc    Delete user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
});

/**
 * @route   GET /api/user/stats/dashboard
 * @desc    Get user statistics for dashboard (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats/dashboard', protect, adminOnly, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            activeUsers,
            adminUsers,
            recentUsers,
            roleStats,
            monthlyRegistrations
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]),
            User.aggregate([
                {
                    $match: { createdAt: { $gte: thirtyDaysAgo } }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                adminUsers,
                recentUsers,
                roleStats: roleStats.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                monthlyRegistrations
            }
        });
    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics'
        });
    }
});

export default router;