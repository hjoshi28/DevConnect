import Profile from '../models/Profile.js';
import { getGithubStats } from '../services/githubService.js';
import { getLeetCodeStats } from '../services/leetcodeService.js';

// @desc    Sync GitHub stats
// @route   POST /api/integrations/github
// @access  Private
export const syncGithub = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'GitHub username is required' });
  }

  try {
    const githubResult = await getGithubStats(username);

    if (!githubResult.success) {
      return res.status(400).json({ message: githubResult.message });
    }

    // Update profile
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({ user: req.user._id, githubUsername: username });
    } else {
      profile.githubUsername = username;
    }

    await profile.save();

    res.json({ message: 'GitHub synced successfully', data: githubResult.data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync LeetCode stats
// @route   POST /api/integrations/leetcode
// @access  Private
export const syncLeetCode = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'LeetCode username is required' });
  }

  try {
    const leetcodeResult = await getLeetCodeStats(username);

    if (!leetcodeResult.success) {
      return res.status(400).json({ message: leetcodeResult.message });
    }

    // Update profile
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({ user: req.user._id, leetcodeUsername: username });
    } else {
      profile.leetcodeUsername = username;
    }

    await profile.save();

    res.json({ message: 'LeetCode synced successfully', data: leetcodeResult.data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get GitHub stats for a user
// @route   GET /api/integrations/github/:username
// @access  Public
export const getGithubData = async (req, res) => {
  try {
    const result = await getGithubStats(req.params.username);
    if (!result.success) return res.status(404).json({ message: result.message });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get LeetCode stats for a user
// @route   GET /api/integrations/leetcode/:username
// @access  Public
export const getLeetCodeData = async (req, res) => {
  try {
    const result = await getLeetCodeStats(req.params.username);
    if (!result.success) return res.status(404).json({ message: result.message });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
