import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  college: String,
  branch: String,
  graduationYear: Number,
  location: String,
  bio: String,
  companyName: String,
  companyWebsite: String,
  companyDescription: String,
  skills: {
    languages: [String],
    frameworks: [String],
    databases: [String],
    tools: [String]
  },
  experience: [
    {
      title: String,
      company: String,
      location: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      from: Date,
      to: Date,
      current: Boolean,
      cgpa: Number
    }
  ],
  achievements: [String],
  githubUsername: String,
  leetcodeUsername: String,
  placementReadinessScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
