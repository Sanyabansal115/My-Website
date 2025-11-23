/**
 * Education Routes - CRUD operations for education records
 * 
 * Handles educational background, qualifications, and certifications.
 * Public can view, admins can manage all records.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Education from '../models/Education.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/education
 * @desc    Get all visible education records
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            type,
            limit = 20,
            sortBy = 'startDate',
            sortOrder = 'desc'
        } = req.query;

        // Build query - only visible records for non-admins
        const query = req.user && req.user.role === 'admin' ? {} : { isVisible: true };
        
        if (type) query.type = type;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Add secondary sort by sortOrder field
        if (sortBy !== 'sortOrder') {
            sort.sortOrder = 1;
        }

        const education = await Education.find(query)
            .populate('createdBy', 'name email')
            .sort(sort)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { education }
        });
    } catch (error) {
        console.error('Get education error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching education records'
        });
    }
});

/**
 * @route   GET /api/education/:id
 * @desc    Get single education record
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const query = { _id: req.params.id };
        
        // Add visibility check for non-admins
        if (!req.user || req.user.role !== 'admin') {
            query.isVisible = true;
        }

        const education = await Education.findOne(query)
            .populate('createdBy', 'name email');

        if (!education) {
            return res.status(404).json({
                success: false,
                message: 'Education record not found'
            });
        }

        res.json({
            success: true,
            data: { education }
        });
    } catch (error) {
        console.error('Get education error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching education record'
        });
    }
});

/**
 * @route   POST /api/education
 * @desc    Create new education record (Admin only)
 * @access  Private (Admin)
 */
router.post('/', protect, adminOnly, [
    body('institution')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Institution name must be between 2 and 200 characters'),
    body('degree')
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Degree must be between 2 and 150 characters'),
    body('fieldOfStudy')
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Field of study must be between 2 and 150 characters'),
    body('startDate')
        .isISO8601()
        .withMessage('Please provide a valid start date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid end date'),
    body('type')
        .optional()
        .isIn(['formal', 'certification', 'course', 'workshop', 'seminar'])
        .withMessage('Invalid education type'),
    body('percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Percentage must be between 0 and 100'),
    body('cgpa')
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage('CGPA must be between 0 and 10')
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

        const educationData = {
            ...req.body,
            createdBy: req.user._id
        };

        // Handle currently studying logic
        if (req.body.isCurrentlyStudying) {
            educationData.endDate = null;
        }

        const education = new Education(educationData);
        await education.save();

        // Populate createdBy field
        await education.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Education record created successfully',
            data: { education }
        });
    } catch (error) {
        console.error('Create education error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating education record'
        });
    }
});

/**
 * @route   PUT /api/education/:id
 * @desc    Update education record (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', protect, adminOnly, [
    body('institution')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Institution name must be between 2 and 200 characters'),
    body('degree')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Degree must be between 2 and 150 characters'),
    body('fieldOfStudy')
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage('Field of study must be between 2 and 150 characters'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid start date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid end date'),
    body('type')
        .optional()
        .isIn(['formal', 'certification', 'course', 'workshop', 'seminar'])
        .withMessage('Invalid education type'),
    body('percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Percentage must be between 0 and 100'),
    body('cgpa')
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage('CGPA must be between 0 and 10')
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

        const updateData = { ...req.body };

        // Handle currently studying logic
        if (req.body.isCurrentlyStudying) {
            updateData.endDate = null;
        }

        const education = await Education.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!education) {
            return res.status(404).json({
                success: false,
                message: 'Education record not found'
            });
        }

        res.json({
            success: true,
            message: 'Education record updated successfully',
            data: { education }
        });
    } catch (error) {
        console.error('Update education error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating education record'
        });
    }
});

/**
 * @route   DELETE /api/education/:id
 * @desc    Delete education record (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const education = await Education.findByIdAndDelete(req.params.id);

        if (!education) {
            return res.status(404).json({
                success: false,
                message: 'Education record not found'
            });
        }

        res.json({
            success: true,
            message: 'Education record deleted successfully'
        });
    } catch (error) {
        console.error('Delete education error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting education record'
        });
    }
});

/**
 * @route   PUT /api/education/:id/visibility
 * @desc    Toggle education record visibility (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/visibility', protect, adminOnly, async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);

        if (!education) {
            return res.status(404).json({
                success: false,
                message: 'Education record not found'
            });
        }

        education.isVisible = !education.isVisible;
        await education.save();

        res.json({
            success: true,
            message: `Education record ${education.isVisible ? 'shown' : 'hidden'} successfully`,
            data: { education }
        });
    } catch (error) {
        console.error('Toggle visibility error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating visibility'
        });
    }
});

/**
 * @route   GET /api/education/admin/all
 * @desc    Get all education records with admin info (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            type,
            isVisible,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};
        
        if (type) query.type = type;
        if (isVisible !== undefined) query.isVisible = isVisible === 'true';
        if (search) {
            query.$or = [
                { institution: { $regex: search, $options: 'i' } },
                { degree: { $regex: search, $options: 'i' } },
                { fieldOfStudy: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [education, total] = await Promise.all([
            Education.find(query)
                .populate('createdBy', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Education.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: {
                education,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get admin education error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching education records'
        });
    }
});

export default router;