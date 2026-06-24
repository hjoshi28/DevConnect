import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, GraduationCap, GitBranch, Code, ExternalLink, MessageSquare } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/user/${id}`);
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching public profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading profile...</div>;

  if (!profile) return <div className="text-center py-20 text-red-400">Profile not found. The user may not have set up their profile yet.</div>;

  const isOwnProfile = currentUser?._id === profile.user?._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      {/* Header Section */}
      <div className="bg-surface rounded-2xl p-8 border border-gray-800 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className="w-32 h-32 rounded-full border-4 border-surface bg-gray-800 overflow-hidden shrink-0">
            {profile.user?.avatar ? (
              <img src={profile.user.avatar} alt={profile.user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500 font-bold">
                {profile.user?.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{profile.user?.name}</h1>
            <p className="text-primary font-medium mt-1">{profile?.bio || 'Developer'}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-400">
              {profile?.location && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
              )}
              {profile.user?.role !== 'recruiter' && profile?.college && (
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.college}</span>
              )}
              {profile.user?.role !== 'recruiter' && profile?.githubUsername && (
                <span className="flex items-center gap-1"><GitBranch className="w-4 h-4" /> {profile.githubUsername}</span>
              )}
              {profile.user?.role === 'recruiter' && profile?.companyName && (
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profile.companyName}</span>
              )}
              {profile.user?.role === 'recruiter' && profile?.companyWebsite && (
                <span className="flex items-center gap-1"><ExternalLink className="w-4 h-4" /> <a href={profile.companyWebsite} target="_blank" rel="noreferrer" className="hover:text-primary">{profile.companyWebsite}</a></span>
              )}
            </div>
          </div>
          
          {!isOwnProfile && (
            <button 
              onClick={() => navigate(`/chat/${profile.user._id}`)}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          )}
          {isOwnProfile && (
            <button 
              onClick={() => navigate('/profile')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Edit My Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {profile.user?.role === 'recruiter' ? (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-surface rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Briefcase className="w-5 h-5 text-purple-400" /> About {profile?.companyName || 'Company'}</h2>
              <p className="text-gray-300 leading-relaxed">
                {profile?.companyDescription || 'No description provided.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Column (Developer) */}
            <div className="space-y-6 lg:col-span-1">
              {/* Skills */}
              <div className="bg-surface rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Code className="w-5 h-5 text-blue-400" /> Skills</h2>
                {profile?.skills?.languages?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.languages.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills listed.</p>
                )}
              </div>

              {/* Education */}
              <div className="bg-surface rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><GraduationCap className="w-5 h-5 text-emerald-400" /> Education</h2>
                {profile?.education?.length > 0 ? (
                  <div className="space-y-4">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="border-l-2 border-gray-800 pl-4 py-1">
                        <h3 className="font-bold text-gray-200">{edu.school}</h3>
                        <p className="text-sm text-gray-400">{edu.degree} in {edu.fieldOfStudy}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(edu.from).getFullYear()} - {edu.current ? 'Present' : new Date(edu.to).getFullYear()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No education listed.</p>
                )}
              </div>
            </div>

            {/* Right Column (Developer) */}
            <div className="space-y-6 lg:col-span-2">
              {/* Integrations */}
              {(profile?.githubUsername || profile?.leetcodeUsername) && (
                <div className="bg-surface rounded-xl p-6 border border-gray-800">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><ExternalLink className="w-5 h-5 text-indigo-400" /> Connected Accounts</h2>
                  <div className="flex flex-wrap gap-4">
                    {profile?.githubUsername && (
                      <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg border border-gray-800 w-full sm:w-auto flex-1">
                        <GitBranch className="w-8 h-8 text-white" />
                        <div>
                          <h3 className="font-bold text-white">GitHub</h3>
                          <p className="text-sm text-gray-400">{profile.githubUsername}</p>
                        </div>
                      </div>
                    )}
                    {profile?.leetcodeUsername && (
                      <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg border border-gray-800 w-full sm:w-auto flex-1">
                        <Code className="w-8 h-8 text-yellow-500" />
                        <div>
                          <h3 className="font-bold text-white">LeetCode</h3>
                          <p className="text-sm text-gray-400">{profile.leetcodeUsername}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience */}
              <div className="bg-surface rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Briefcase className="w-5 h-5 text-purple-400" /> Experience</h2>
                {profile?.experience?.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="relative">
                        <h3 className="font-bold text-lg text-white">{exp.title}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-xs text-gray-500 mb-2">{new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No experience listed.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
