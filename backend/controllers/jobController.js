import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { title, skills, location } = req.query;
    let query = { status: 'Open' };

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (skills) {
      // Expecting a comma-separated list of skills
      const skillArray = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillArray };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', ['name', 'avatar'])
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', ['name', 'avatar']);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    if (error.kind == 'ObjectId') return res.status(404).json({ message: 'Job not found' });
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
export const createJob = async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Only recruiters can post jobs' });
  }

  const { title, companyName, description, location, employmentType, experienceLevel, requiredSkills, salaryRange, deadline } = req.body;

  try {
    const newJob = new Job({
      recruiter: req.user._id,
      title,
      companyName,
      description,
      location,
      employmentType,
      experienceLevel,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()) : []),
      salaryRange,
      deadline
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only, Job Owner only)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the user owns the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    const updatedData = { ...req.body };
    if (updatedData.requiredSkills && typeof updatedData.requiredSkills === 'string') {
      updatedData.requiredSkills = updatedData.requiredSkills.split(',').map(s => s.trim());
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { returnDocument: 'after' }
    );

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only, Job Owner only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the user owns the job
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
