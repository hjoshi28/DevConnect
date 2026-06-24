import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  employmentType: {
    type: String, // e.g., Full-time, Part-time, Contract, Internship
    required: true
  },
  experienceLevel: {
    type: String, // e.g., Entry-level, Mid-level, Senior, Executive
    required: true
  },
  requiredSkills: [String],
  salaryRange: {
    type: String
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
