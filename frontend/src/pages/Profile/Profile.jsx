import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, MapPin, GraduationCap, GitBranch, Code, ExternalLink, Plus, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [syncingLeetCode, setSyncingLeetCode] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [leetcodeInput, setLeetcodeInput] = useState('');

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'edit', 'skill', 'education', 'experience'
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile/me');
      setProfile(res.data);
    } catch (error) {
      console.log('No profile found or error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSyncGithub = async () => {
    if (!githubInput) return;
    setSyncingGithub(true);
    try {
      await axios.post('/api/integrations/github', { username: githubInput });
      await fetchProfile();
    } catch (error) {
      console.error(error);
    } finally {
      setSyncingGithub(false);
    }
  };

  const handleSyncLeetCode = async () => {
    if (!leetcodeInput) return;
    setSyncingLeetCode(true);
    try {
      await axios.post('/api/integrations/leetcode', { username: leetcodeInput });
      await fetchProfile();
    } catch (error) {
      console.error(error);
    } finally {
      setSyncingLeetCode(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let updatedPayload = { ...profile };

      if (activeModal === 'edit') {
        updatedPayload.bio = formData.bio;
        updatedPayload.location = formData.location;
        updatedPayload.college = formData.college;
      } else if (activeModal === 'company') {
        updatedPayload.companyName = formData.companyName;
        updatedPayload.companyWebsite = formData.companyWebsite;
        updatedPayload.companyDescription = formData.companyDescription;
      } else if (activeModal === 'skill') {
        const currentLangs = [...(profile?.skills?.languages || [])];
        if (editIndex !== null) currentLangs[editIndex] = formData.skill;
        else currentLangs.push(formData.skill);
        updatedPayload.skills = { ...profile?.skills, languages: currentLangs };
      } else if (activeModal === 'education') {
        const newEdu = {
          school: formData.school,
          degree: formData.degree,
          fieldOfStudy: formData.fieldOfStudy,
          from: formData.from,
          to: formData.to,
          current: !formData.to
        };
        const currentEdu = [...(profile?.education || [])];
        if (editIndex !== null) currentEdu[editIndex] = newEdu;
        else currentEdu.push(newEdu);
        updatedPayload.education = currentEdu;
      } else if (activeModal === 'experience') {
        const newExp = {
          company: formData.company,
          title: formData.title,
          description: formData.description,
          from: formData.from,
          to: formData.to,
          current: !formData.to
        };
        const currentExp = [...(profile?.experience || [])];
        if (editIndex !== null) currentExp[editIndex] = newExp;
        else currentExp.push(newExp);
        updatedPayload.experience = currentExp;
      }

      await axios.post('/api/profile', updatedPayload);
      await fetchProfile();
      setActiveModal(null);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type, index) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      let updatedPayload = { ...profile };
      if (type === 'skill') {
        updatedPayload.skills.languages = updatedPayload.skills.languages.filter((_, i) => i !== index);
      } else if (type === 'education') {
        updatedPayload.education = updatedPayload.education.filter((_, i) => i !== index);
      } else if (type === 'experience') {
        updatedPayload.experience = updatedPayload.experience.filter((_, i) => i !== index);
      }
      await axios.post('/api/profile', updatedPayload);
      await fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const openModal = (type, index = null) => {
    setEditIndex(index);
    setFormData({});
    if (type === 'edit') {
      setFormData({ bio: profile?.bio || '', location: profile?.location || '', college: profile?.college || '' });
    } else if (type === 'company') {
      setFormData({ companyName: profile?.companyName || '', companyWebsite: profile?.companyWebsite || '', companyDescription: profile?.companyDescription || '' });
    } else if (index !== null) {
      if (type === 'skill') {
        setFormData({ skill: profile.skills.languages[index] });
      } else if (type === 'education') {
        const edu = profile.education[index];
        setFormData({ ...edu, from: edu.from?.split('T')[0] || '', to: edu.to?.split('T')[0] || '' });
      } else if (type === 'experience') {
        const exp = profile.experience[index];
        setFormData({ ...exp, from: exp.from?.split('T')[0] || '', to: exp.to?.split('T')[0] || '' });
      }
    }
    setActiveModal(type);
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading profile...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 capitalize">
              {activeModal === 'edit' ? 'Edit Profile' : activeModal === 'company' ? 'Edit Company Info' : `Add ${activeModal}`}
            </h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              
              {activeModal === 'edit' && (
                <>
                  <input required placeholder="Bio" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <input placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <input placeholder="College/University" value={formData.college || ''} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                </>
              )}

              {activeModal === 'company' && (
                <>
                  <input required placeholder="Company Name" value={formData.companyName || ''} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <input placeholder="Company Website (e.g. https://example.com)" value={formData.companyWebsite || ''} onChange={e => setFormData({...formData, companyWebsite: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <textarea placeholder="Company Description" value={formData.companyDescription || ''} onChange={e => setFormData({...formData, companyDescription: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" rows="3"></textarea>
                </>
              )}

              {activeModal === 'skill' && (
                <input required placeholder="e.g. React, Python, AWS" value={formData.skill || ''} onChange={e => setFormData({...formData, skill: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
              )}

              {activeModal === 'education' && (
                <>
                  <input required placeholder="School/University" value={formData.school || ''} onChange={e => setFormData({...formData, school: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <input required placeholder="Degree (e.g. B.Tech)" value={formData.degree || ''} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <input required placeholder="Field of Study (e.g. Computer Science)" value={formData.fieldOfStudy || ''} onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <div className="flex gap-4">
                    <input required type="date" value={formData.from || ''} onChange={e => setFormData({...formData, from: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                    <input type="date" value={formData.to || ''} onChange={e => setFormData({...formData, to: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  </div>
                  <p className="text-xs text-slate-500">Leave end date blank if currently attending</p>
                </>
              )}

              {activeModal === 'experience' && (
                <>
                  <input required placeholder="Company" value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <input required placeholder="Job Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  <textarea required placeholder="Description of what you did..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" rows="3"></textarea>
                  <div className="flex gap-4">
                    <input required type="date" value={formData.from || ''} onChange={e => setFormData({...formData, from: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                    <input type="date" value={formData.to || ''} onChange={e => setFormData({...formData, to: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                  </div>
                  <p className="text-xs text-slate-500">Leave end date blank if currently working here</p>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-blue-800 text-white px-6 py-2 rounded-lg disabled:bg-slate-300 shadow-sm hover:shadow-md transition-all">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100"></div>
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shrink-0 shadow-md">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400 font-bold">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-primary font-medium mt-1">{profile?.bio || 'Add a bio to introduce yourself'}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-slate-500">
              {profile?.location && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
              )}
              {user?.role !== 'recruiter' && profile?.college && (
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.college}</span>
              )}
              {user?.role !== 'recruiter' && profile?.githubUsername && (
                <span className="flex items-center gap-1"><GitBranch className="w-4 h-4" /> {profile.githubUsername}</span>
              )}
              {user?.role === 'recruiter' && profile?.companyName && (
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profile.companyName}</span>
              )}
              {user?.role === 'recruiter' && profile?.companyWebsite && (
                <span className="flex items-center gap-1"><ExternalLink className="w-4 h-4" /> <a href={profile.companyWebsite} target="_blank" rel="noreferrer" className="hover:text-primary">{profile.companyWebsite}</a></span>
              )}
            </div>
          </div>
          <button onClick={() => openModal(user?.role === 'recruiter' ? 'company' : 'edit')} className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium border border-slate-200 transition-all shadow-sm">
            Edit {user?.role === 'recruiter' ? 'Company Info' : 'Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {user?.role === 'recruiter' ? (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-600" /> About {profile?.companyName || 'Company'}</h2>
                <button onClick={() => openModal('company')} className="text-slate-400 hover:text-primary"><Edit2 className="w-5 h-5" /></button>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {profile?.companyDescription || 'Please add a description of your company.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Column (Developer View) */}
            <div className="space-y-6 lg:col-span-1">
              {/* Skills */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Code className="w-5 h-5 text-blue-600" /> Skills</h2>
                  <button onClick={() => openModal('skill')} className="text-slate-400 hover:text-primary"><Plus className="w-5 h-5" /></button>
                </div>
                {profile?.skills?.languages?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.languages.map((skill, i) => (
                      <span key={i} className="relative group px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-sm border border-slate-200 flex items-center cursor-pointer hover:bg-slate-100 font-medium transition-colors">
                        {skill}
                        <div className="absolute -top-4 -right-2 hidden group-hover:flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-xl z-10">
                          <button onClick={(e) => { e.stopPropagation(); openModal('skill', i); }} className="text-slate-400 hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete('skill', i); }} className="text-red-500 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No skills added yet.</p>
                )}
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-emerald-600" /> Education</h2>
                  <button onClick={() => openModal('education')} className="text-slate-400 hover:text-primary"><Plus className="w-5 h-5" /></button>
                </div>
                {profile?.education?.length > 0 ? (
                  <div className="space-y-4">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="group border-l-2 border-slate-200 pl-4 py-1 relative">
                        <div className="absolute right-0 top-0 hidden group-hover:flex gap-2">
                          <button onClick={() => openModal('education', i)} className="text-slate-400 hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('education', i)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <h3 className="font-bold text-slate-900">{edu.school}</h3>
                        <p className="text-sm text-slate-700">{edu.degree} in {edu.fieldOfStudy}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(edu.from).getFullYear()} - {edu.current ? 'Present' : new Date(edu.to).getFullYear()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No education added yet.</p>
                )}
              </div>
            </div>

            {/* Right Column (Developer View) */}
            <div className="space-y-6 lg:col-span-2">

          {user?.role !== 'recruiter' && (
            <>
              {/* Integrations */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6"><ExternalLink className="w-5 h-5 text-indigo-600" /> Integrations</h2>

            <div className="space-y-4">
              {/* GitHub */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-8 h-8 text-slate-800" />
                  <div>
                    <h3 className="font-bold text-slate-900">GitHub</h3>
                    <p className="text-sm text-slate-500">{profile?.githubUsername ? `Connected as ${profile.githubUsername}` : 'Not connected'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!profile?.githubUsername && (
                    <input
                      type="text"
                      placeholder="Username"
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm w-32"
                    />
                  )}
                  <button
                    onClick={handleSyncGithub}
                    disabled={syncingGithub || (!profile?.githubUsername && !githubInput)}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-sm border border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 shadow-sm transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingGithub ? 'animate-spin' : ''}`} />
                    {profile?.githubUsername ? 'Sync' : 'Connect'}
                  </button>
                </div>
              </div>

              {/* LeetCode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <Code className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h3 className="font-bold text-slate-900">LeetCode</h3>
                    <p className="text-sm text-slate-500">{profile?.leetcodeUsername ? `Connected as ${profile.leetcodeUsername}` : 'Not connected'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!profile?.leetcodeUsername && (
                    <input
                      type="text"
                      placeholder="Username"
                      value={leetcodeInput}
                      onChange={(e) => setLeetcodeInput(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm w-32"
                    />
                  )}
                  <button
                    onClick={handleSyncLeetCode}
                    disabled={syncingLeetCode || (!profile?.leetcodeUsername && !leetcodeInput)}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-sm border border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 shadow-sm transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingLeetCode ? 'animate-spin' : ''}`} />
                    {profile?.leetcodeUsername ? 'Sync' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Experience */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-600" /> Experience</h2>
              <button onClick={() => openModal('experience')} className="text-slate-400 hover:text-primary"><Plus className="w-5 h-5" /></button>
            </div>
            {profile?.experience?.length > 0 ? (
              <div className="space-y-6">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute right-0 top-0 hidden group-hover:flex gap-2">
                      <button onClick={() => openModal('experience', i)} className="text-slate-400 hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('experience', i)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-xs text-slate-500 mb-2">{new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No experience added yet.</p>
            )}
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
