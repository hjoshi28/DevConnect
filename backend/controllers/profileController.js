import Profile from '../models/Profile.js';

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar', 'email', 'role']);

    if (!profile) {
      return res.status(404).json({ message: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
export const upsertProfile = async (req, res) => {
  const {
    college, branch, graduationYear, location, bio,
    companyName, companyWebsite, companyDescription,
    skills, experience, education, achievements,
    githubUsername, leetcodeUsername
  } = req.body;

  // Build profile object
  const profileFields = { user: req.user._id };
  if (college !== undefined) profileFields.college = college;
  if (branch !== undefined) profileFields.branch = branch;
  if (graduationYear !== undefined) profileFields.graduationYear = graduationYear;
  if (location !== undefined) profileFields.location = location;
  if (bio !== undefined) profileFields.bio = bio;
  
  if (companyName !== undefined) profileFields.companyName = companyName;
  if (companyWebsite !== undefined) profileFields.companyWebsite = companyWebsite;
  if (companyDescription !== undefined) profileFields.companyDescription = companyDescription;

  if (achievements !== undefined) profileFields.achievements = Array.isArray(achievements) ? achievements : achievements.split(',').map(item => item.trim());
  if (githubUsername !== undefined) profileFields.githubUsername = githubUsername;
  if (leetcodeUsername !== undefined) profileFields.leetcodeUsername = leetcodeUsername;

  if (skills) profileFields.skills = skills;
  if (experience) profileFields.experience = experience;
  if (education) profileFields.education = education;

  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { returnDocument: 'after' }
      );
      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all profiles
// @route   GET /api/profile
// @access  Public
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar', 'role']);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:user_id
// @access  Public
export const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar', 'role']);

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: error.message });
  }
};
