/**
 * Contact Routes - CRUD operations for contact form submissions
 * 
 * Handles contact form submissions with admin management capabilities.
 * Public can submit, admins can view and manage all submissions.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a new contact form
 * @access  Public
 */
router.post('/', [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('subject')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Subject must be between 5 and 200 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Phone number cannot exceed 20 characters')
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

        const { name, email, subject, message, phone } = req.body;

        // Get client IP address
        const ipAddress = req.ip || req.connection.remoteAddress;

        const contact = new Contact({
            name,
            email,
            subject,
            message,
            phone,
            ipAddress
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully! I will get back to you soon.',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                message: contact.message,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact submissions (Admin only)
 * @access  Private (Admin)
 */
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};
        
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get contacts with pagination
        const [contacts, total] = await Promise.all([
            Contact.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Contact.countDocuments(query)
        ]);

        // Get status counts for dashboard
        const statusCounts = await Contact.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                contacts,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    page: parseInt(page),
                    limit: parseInt(limit)
                },
                statusCounts: statusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
});

/**
 * @route   GET /api/contact/:id
 * @desc    Get single contact by ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: { contact }
        });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact'
        });
    }
});

/**
 * @route   PUT /api/contact/:id
 * @desc    Update contact status/notes (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', protect, adminOnly, [
    body('status')
        .optional()
        .isIn(['new', 'read', 'replied', 'archived'])
        .withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority'),
    body('adminNotes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Admin notes cannot exceed 500 characters')
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

        const { status, priority, adminNotes } = req.body;
        const updateData = {};

        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: { contact }
        });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact'
        });
    }
});

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact'
        });
    }
});

/**
 * @route   GET /api/contact/stats/dashboard
 * @desc    Get contact statistics for dashboard (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats/dashboard', protect, adminOnly, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalContacts,
            newContacts,
            recentContacts,
            priorityStats,
            monthlyStats
        ] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'new' }),
            Contact.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            Contact.aggregate([
                { $group: { _id: '$priority', count: { $sum: 1 } } }
            ]),
            Contact.aggregate([
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
                totalContacts,
                newContacts,
                recentContacts,
                priorityStats: priorityStats.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                monthlyStats
            }
        });
    } catch (error) {
        console.error('Contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact statistics'
        });
    }
});

export default router;