import User from '../models/User.js';
import Profile from '../models/Profile.js';

// @desc    Get all users for networking
// @route   GET /api/network/users
// @access  Private
export const getNetworkUsers = async (req, res) => {
  try {
    // Get all users except current
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password').sort({ createdAt: -1 });

    // Get profiles for these users
    const profiles = await Profile.find({ user: { $in: users.map(u => u._id) } });

    // Combine them
    const networkData = users.map(user => {
      const profile = profiles.find(p => p.user.toString() === user._id.toString());
      
      // Flatten skills object into a simple array
      let flatSkills = [];
      if (profile?.skills) {
        flatSkills = [
          ...(profile.skills.languages || []),
          ...(profile.skills.frameworks || []),
          ...(profile.skills.databases || []),
          ...(profile.skills.tools || [])
        ];
      }

      return {
        _id: profile ? profile._id : user._id,
        user: user,
        role: user.role,
        bio: profile?.bio || '',
        location: profile?.location || '',
        skills: flatSkills,
        about: profile?.about || ''
      };
    });

    res.json(networkData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top candidates (Recruiter only)
// @route   GET /api/network/candidates
// @access  Private
export const getCandidates = async (req, res) => {
  try {
    // Only return students
    const studentUsers = await User.find({ role: 'student', _id: { $ne: req.user._id } }).select('-password').sort({ createdAt: -1 });

    const profiles = await Profile.find({ user: { $in: studentUsers.map(u => u._id) } });

    const candidatesData = studentUsers.map(user => {
      const profile = profiles.find(p => p.user.toString() === user._id.toString());
      
      let flatSkills = [];
      if (profile?.skills) {
        flatSkills = [
          ...(profile.skills.languages || []),
          ...(profile.skills.frameworks || []),
          ...(profile.skills.databases || []),
          ...(profile.skills.tools || [])
        ];
      }

      return {
        _id: profile ? profile._id : user._id,
        user: user,
        role: user.role,
        bio: profile?.bio || '',
        location: profile?.location || '',
        skills: flatSkills,
        about: profile?.about || ''
      };
    });

    res.json(candidatesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
