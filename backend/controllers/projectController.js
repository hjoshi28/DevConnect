import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('user', ['name', 'avatar']);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', ['name', 'avatar']);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    if (error.kind == 'ObjectId') return res.status(404).json({ message: 'Project not found' });
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const { title, description, techStack, githubLink, liveDemoLink } = req.body;

  const images = [];

  try {
    const newProject = new Project({
      user: req.user._id,
      title,
      description,
      techStack: typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : techStack,
      githubLink,
      liveDemoLink,
      images
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.user.toString() !== req.user._id.toString() && req.user.role !== 'recruiter') {
        res.status(401);
        throw new Error('Not authorized to delete this project');
      }
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on a project
// @route   POST /api/projects/:id/like
// @access  Private
export const toggleLikeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const hasLikedIndex = project.metrics.likes.findIndex(id => id.toString() === userId);

    if (hasLikedIndex !== -1) {
      // User already liked it, so unlike it
      project.metrics.likes.splice(hasLikedIndex, 1);
    } else {
      // User hasn't liked it, so like it
      project.metrics.likes.push(userId);
    }

    const updatedProject = await project.save();
    // Populate user to return exactly what frontend expects for a fully formed project object
    await updatedProject.populate('user', ['name', 'avatar']);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
