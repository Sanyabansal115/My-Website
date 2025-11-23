/**
 * Project Routes - CRUD operations for portfolio projects
 * 
 * Handles project showcase with detailed information, technologies,
 * images, and links. Public can view, admins can manage all records.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all visible projects
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            category,
            featured,
            status,
            limit = 20,
            page = 1,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query - only visible projects for non-admins
        const query = req.user && req.user.role === 'admin' ? {} : { isVisible: true };
        
        if (category) query.category = category;
        if (featured !== undefined) query.isFeatured = featured === 'true';
        if (status) query.status = status;
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { technologies: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Add secondary sorts for featured and sort order
        if (sortBy !== 'isFeatured') {
            sort.isFeatured = -1;
        }
        if (sortBy !== 'sortOrder') {
            sort.sortOrder = 1;
        }

        const [projects, total] = await Promise.all([
            Project.find(query)
                .populate('createdBy', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Project.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: {
                projects,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects'
        });
    }
});

/**
 * @route   GET /api/projects/featured
 * @desc    Get featured projects
 * @access  Public
 */
router.get('/featured', optionalAuth, async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const query = { isFeatured: true };
        if (!req.user || req.user.role !== 'admin') {
            query.isVisible = true;
        }

        const projects = await Project.find(query)
            .populate('createdBy', 'name email')
            .sort({ sortOrder: 1, createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { projects }
        });
    } catch (error) {
        console.error('Get featured projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured projects'
        });
    }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project with view increment
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const query = { _id: req.params.id };
        
        // Add visibility check for non-admins
        if (!req.user || req.user.role !== 'admin') {
            query.isVisible = true;
        }

        const project = await Project.findOne(query)
            .populate('createdBy', 'name email')
            .populate('likes.userId', 'name email');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Increment view count (don't wait for this to complete)
        Project.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } }
        ).exec();

        res.json({
            success: true,
            data: { project }
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project'
        });
    }
});

/**
 * @route   POST /api/projects
 * @desc    Create new project (Admin only)
 * @access  Private (Admin)
 */
router.post('/', protect, adminOnly, [
    body('title')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('category')
        .isIn(['web-development', 'mobile-app', 'data-science', 'ai-machine-learning', 'desktop-app', 'other'])
        .withMessage('Invalid category'),
    body('startDate')
        .isISO8601()
        .withMessage('Please provide a valid start date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid end date'),
    body('status')
        .optional()
        .isIn(['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'])
        .withMessage('Invalid status'),
    body('difficulty')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
        .withMessage('Invalid difficulty level'),
    body('teamSize')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Team size must be between 1 and 50'),
    body('technologies')
        .isArray({ min: 1 })
        .withMessage('At least one technology is required'),
    body('links.live')
        .optional()
        .isURL()
        .withMessage('Please provide a valid live URL'),
    body('links.github')
        .optional()
        .isURL()
        .withMessage('Please provide a valid GitHub URL'),
    body('links.demo')
        .optional()
        .isURL()
        .withMessage('Please provide a valid demo URL')
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

        const projectData = {
            ...req.body,
            createdBy: req.user._id
        };

        // Handle ongoing project logic
        if (req.body.isOngoing) {
            projectData.endDate = null;
            projectData.status = 'in-progress';
        }

        const project = new Project(projectData);
        await project.save();

        // Populate createdBy field
        await project.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: { project }
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project'
        });
    }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', protect, adminOnly, [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('category')
        .optional()
        .isIn(['web-development', 'mobile-app', 'data-science', 'ai-machine-learning', 'desktop-app', 'other'])
        .withMessage('Invalid category'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid start date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid end date'),
    body('status')
        .optional()
        .isIn(['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'])
        .withMessage('Invalid status'),
    body('difficulty')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
        .withMessage('Invalid difficulty level'),
    body('teamSize')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Team size must be between 1 and 50'),
    body('links.live')
        .optional()
        .isURL()
        .withMessage('Please provide a valid live URL'),
    body('links.github')
        .optional()
        .isURL()
        .withMessage('Please provide a valid GitHub URL'),
    body('links.demo')
        .optional()
        .isURL()
        .withMessage('Please provide a valid demo URL')
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

        // Handle ongoing project logic
        if (req.body.isOngoing) {
            updateData.endDate = null;
            updateData.status = 'in-progress';
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: { project }
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating project'
        });
    }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting project'
        });
    }
});

/**
 * @route   PUT /api/projects/:id/visibility
 * @desc    Toggle project visibility (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/visibility', protect, adminOnly, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        project.isVisible = !project.isVisible;
        await project.save();

        res.json({
            success: true,
            message: `Project ${project.isVisible ? 'shown' : 'hidden'} successfully`,
            data: { project }
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
 * @route   PUT /api/projects/:id/featured
 * @desc    Toggle project featured status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/featured', protect, adminOnly, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        project.isFeatured = !project.isFeatured;
        await project.save();

        res.json({
            success: true,
            message: `Project ${project.isFeatured ? 'featured' : 'unfeatured'} successfully`,
            data: { project }
        });
    } catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating featured status'
        });
    }
});

/**
 * @route   POST /api/projects/:id/like
 * @desc    Like/unlike a project (Authenticated users)
 * @access  Private
 */
router.post('/:id/like', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const existingLikeIndex = project.likes.findIndex(
            like => like.userId.toString() === req.user._id.toString()
        );

        if (existingLikeIndex > -1) {
            // Unlike the project
            project.likes.splice(existingLikeIndex, 1);
        } else {
            // Like the project
            project.likes.push({
                userId: req.user._id,
                timestamp: new Date()
            });
        }

        await project.save();

        res.json({
            success: true,
            message: existingLikeIndex > -1 ? 'Project unliked' : 'Project liked',
            data: {
                liked: existingLikeIndex === -1,
                likeCount: project.likes.length
            }
        });
    } catch (error) {
        console.error('Like project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating project like'
        });
    }
});

/**
 * @route   GET /api/projects/categories/list
 * @desc    Get list of available categories
 * @access  Public
 */
router.get('/categories/list', (req, res) => {
    const categories = [
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-app', label: 'Mobile App' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'ai-machine-learning', label: 'AI & Machine Learning' },
        { value: 'desktop-app', label: 'Desktop Application' },
        { value: 'other', label: 'Other' }
    ];

    res.json({
        success: true,
        data: { categories }
    });
});

export default router;