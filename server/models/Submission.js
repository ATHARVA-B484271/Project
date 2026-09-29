const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    response: {
      type: String,
      trim: true,
    },
    submissionLink: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['ON_TIME', 'LATE'],
      required: true,
    },
    reviewStatus: {
      type: String,
      enum: ['PENDING', 'NEEDS_CHANGES', 'ACCEPTED'],
      default: 'PENDING',
    },
    marks: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound unique index on assignmentId, studentId, and version
submissionSchema.index({ assignmentId: 1, studentId: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
