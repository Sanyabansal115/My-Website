/**
 * Project Model - MongoDB Schema for Portfolio Projects
 * 
 * Stores project information including technologies, descriptions, links,
 * and media assets. Supports categorization and visibility control.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['web-development', 'mobile-app', 'data-science', 'ai-machine-learning', 'desktop-app', 'other'],
        default: 'other'
    },
    technologies: [{
        type: String,
        trim: true,
        maxlength: [50, 'Technology name cannot exceed 50 characters']
    }],
    features: [{
        type: String,
        trim: true,
        maxlength: [200, 'Feature description cannot exceed 200 characters']
    }],
    links: {
        live: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Please provide a valid URL']
        },
        github: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Please provide a valid URL']
        },
        demo: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Please provide a valid URL']
        }
    },
    images: [{
        url: String,
        caption: String,
        isMain: {
            type: Boolean,
            default: false
        }
    }],
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        default: null // null means ongoing project
    },
    isOngoing: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
        default: 'completed'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
    },
    teamSize: {
        type: Number,
        min: [1, 'Team size must be at least 1'],
        max: [50, 'Team size cannot exceed 50'],
        default: 1
    },
    role: {
        type: String,
        trim: true,
        maxlength: [100, 'Role cannot exceed 100 characters']
    },
    challenges: [{
        type: String,
        trim: true,
        maxlength: [300, 'Challenge description cannot exceed 300 characters']
    }],
    learnings: [{
        type: String,
        trim: true,
        maxlength: [300, 'Learning description cannot exceed 300 characters']
    }],
    isVisible: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
    const start = this.startDate;
    const end = this.endDate || new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}`;
    } else {
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
});

// Virtual for like count
projectSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Indexes for efficient querying
projectSchema.index({ isVisible: 1, isFeatured: -1, sortOrder: 1, createdAt: -1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ createdBy: 1 });

export default mongoose.model('Project', projectSchema);