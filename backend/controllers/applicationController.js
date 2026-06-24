import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Developer only)
export const applyToJob = async (req, res) => {
  if (req.user.role === 'recruiter') {
    return res.status(403).json({ message: 'Recruiters cannot apply for jobs' });
  }

  const { coverLetter } = req.body;
  const jobId = req.params.jobId;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ message: 'This job is no longer open for applications' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const newApplication = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter
    });

    const application = await newApplication.save();
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications of the logged-in user
// @route   GET /api/applications/my-applications
// @access  Private (Developer only)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', ['title', 'companyName', 'location', 'status', 'recruiter'])
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only, Job Owner only)
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', ['name', 'email', 'avatar'])
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only, Job Owner only)
export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = application.job;

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this application' });
    }

    // Validate status
    const validStatuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
