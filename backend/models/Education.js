/**
 * Education Model - MongoDB Schema for Education/Qualification Records
 * 
 * Stores educational background, qualifications, certifications, and achievements.
 * Supports ordering and visibility control for admin management.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: [true, 'Institution name is required'],
        trim: true,
        maxlength: [200, 'Institution name cannot exceed 200 characters']
    },
    degree: {
        type: String,
        required: [true, 'Degree/Qualification is required'],
        trim: true,
        maxlength: [150, 'Degree cannot exceed 150 characters']
    },
    fieldOfStudy: {
        type: String,
        required: [true, 'Field of study is required'],
        trim: true,
        maxlength: [150, 'Field of study cannot exceed 150 characters']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        default: null // null means currently studying
    },
    isCurrentlyStudying: {
        type: Boolean,
        default: false
    },
    grade: {
        type: String,
        trim: true,
        maxlength: [50, 'Grade cannot exceed 50 characters']
    },
    percentage: {
        type: Number,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
    },
    cgpa: {
        type: Number,
        min: [0, 'CGPA cannot be negative'],
        max: [10, 'CGPA cannot exceed 10']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    achievements: [{
        type: String,
        trim: true,
        maxlength: [200, 'Achievement cannot exceed 200 characters']
    }],
    skills: [{
        type: String,
        trim: true,
        maxlength: [50, 'Skill cannot exceed 50 characters']
    }],
    location: {
        city: {
            type: String,
            trim: true,
            maxlength: [100, 'City cannot exceed 100 characters']
        },
        state: {
            type: String,
            trim: true,
            maxlength: [100, 'State cannot exceed 100 characters']
        },
        country: {
            type: String,
            trim: true,
            maxlength: [100, 'Country cannot exceed 100 characters']
        }
    },
    type: {
        type: String,
        enum: ['formal', 'certification', 'course', 'workshop', 'seminar'],
        default: 'formal'
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    certificate: {
        url: String,
        filename: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Virtual for duration calculation
educationSchema.virtual('duration').get(function() {
    const start = this.startDate;
    const end = this.endDate || new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else {
        return `${months} month${months > 1 ? 's' : ''}`;
    }
});

// Index for efficient querying
educationSchema.index({ isVisible: 1, sortOrder: 1, startDate: -1 });
educationSchema.index({ createdBy: 1 });

export default mongoose.model('Education', educationSchema);