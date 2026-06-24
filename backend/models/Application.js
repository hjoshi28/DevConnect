import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
    default: 'Applied'
  }
}, {
  timestamps: true
});

// Ensure a user can only apply to a specific job once
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
