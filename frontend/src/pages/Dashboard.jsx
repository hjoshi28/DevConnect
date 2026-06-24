import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Activity, Target, Trophy, TrendingUp, GitBranch, Code, ArrowRight, Loader, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingGap, setAnalyzingGap] = useState(false);
  const [skillGap, setSkillGap] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await axios.get('/api/profile/me');
        setProfile(profileRes.data);

        if (profileRes.data.githubUsername) {
          const ghRes = await axios.get(`/api/integrations/github/${profileRes.data.githubUsername}`);
          setGithubStats(ghRes.data);
        }

        if (profileRes.data.leetcodeUsername) {
          const lcRes = await axios.get(`/api/integrations/leetcode/${profileRes.data.leetcodeUsername}`);
          setLeetcodeStats(lcRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAnalyzeSkillGap = async () => {
    const userSkills = profile?.skills?.languages || [];
    
    if (!userSkills.length) return alert('Please add skills to your profile first.');
    if (!profile.education || !profile.education.length) return alert('Please complete your profile to get a good analysis.');

    setAnalyzingGap(true);
    try {
      // Create a prompt based on their skills
      const targetRoles = ['Software Engineer', 'Full Stack Developer']; // could be made dynamic
      const res = await axios.post('/api/ai/skill-gap', { skills: userSkills, targetRoles });
      setSkillGap(res.data.data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze skill gap. Please try again.');
    } finally {
      setAnalyzingGap(false);
    }
  };

  const calculateReadinessScore = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.bio) score += 10;
    
    const skillsCount = profile.skills?.languages?.length || 0;
    if (skillsCount > 0) score += 10;
    if (skillsCount > 3) score += 15;
    
    if (profile.education?.length > 0) score += 20;
    if (profile.experience?.length > 0) score += 25;
    
    if (profile.githubUsername) score += 10;
    if (profile.leetcodeUsername) score += 10;
    
    return Math.min(score, 100);
  };

  const dynamicReadinessScore = calculateReadinessScore();

  if (loading) return <div className="text-center py-20 text-slate-500">Loading your intelligence...</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Placement Intelligence</h1>
        {user?.role !== 'recruiter' && (
          <Link to="/intelligence" className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
            <Target className="w-4 h-4" /> Analyze Resume
          </Link>
        )}
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Readiness Score', value: `${dynamicReadinessScore}/100`, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Github Stars', value: githubStats ? githubStats.totalStars : '--', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Problems Solved', value: leetcodeStats ? leetcodeStats.totalSolved : '--', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {user?.role === 'recruiter' ? (
          <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Target className="w-16 h-16 text-primary mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to DevConnect AI Recruiting</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8 text-lg">Access our talent pool of developers. Discover candidates based on verified skills, GitHub activity, and LeetCode ratings.</p>
            <Link to="/network" className="inline-flex bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg">
              Browse Top Candidates
            </Link>
          </div>
        ) : (
          <>
            {/* Skill Gap Analyzer */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> Skill Gap Analyzer</h2>
          </div>

          {skillGap ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border-4 border-purple-200 flex items-center justify-center bg-purple-50">
                  <span className="text-xl font-bold text-purple-700">{skillGap.overallMatchPercentage}%</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Overall Match</h3>
                  <p className="text-xs text-slate-500">For Software Engineer Roles</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Critical Gaps to Fill:</p>
                <div className="flex flex-wrap gap-2">
                  {skillGap.criticalGaps?.map((gap, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs border border-red-200">{gap}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Recommended Learning Path</h4>
                <ul className="space-y-2">
                  {skillGap.learningPath?.slice(0, 2).map((path, i) => (
                    <li key={i} className="text-xs text-slate-700">
                      <span className="text-purple-600 font-bold">{path.topic}</span> ({path.estimatedWeeks} wks): {path.reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center py-6 bg-slate-50 rounded-xl border border-slate-300 border-dashed">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-slate-600 max-w-sm text-sm mb-4">Get AI-powered insights on what to learn next based on your profile.</p>
              <button
                onClick={handleAnalyzeSkillGap}
                disabled={analyzingGap}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition-all border border-slate-300 flex items-center gap-2 text-sm shadow-sm hover:shadow-md"
              >
                {analyzingGap ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {analyzingGap ? 'Analyzing Profile...' : 'Analyze My Profile'}
              </button>
            </div>
          )}
        </div>

        {/* GitHub Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><GitBranch className="w-5 h-5 text-slate-600" /> GitHub Activity</h2>
            {!profile?.githubUsername && (
              <Link to="/profile" className="text-sm text-primary hover:text-blue-800 flex items-center gap-1 font-medium transition-colors">Connect <ArrowRight className="w-4 h-4" /></Link>
            )}
          </div>

          {githubStats ? (
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center"><p className="text-slate-500 text-xs font-medium">Public Repos</p><p className="text-lg font-bold text-slate-900">{githubStats.public_repos}</p></div>
                <div className="text-center"><p className="text-slate-500 text-xs font-medium">Followers</p><p className="text-lg font-bold text-slate-900">{githubStats.followers}</p></div>
                <div className="text-center"><p className="text-slate-500 text-xs font-medium">Forks</p><p className="text-lg font-bold text-slate-900">{githubStats.totalForks}</p></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Top Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {githubStats.topLanguages?.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-white text-slate-700 rounded-full text-xs border border-slate-300 font-medium">{lang.name} ({lang.count})</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-300 border-dashed">
              <p className="text-slate-500">Connect your GitHub to see your open-source impact.</p>
            </div>
          )}
        </div>

        {/* LeetCode Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Code className="w-5 h-5 text-yellow-600" /> LeetCode Progress</h2>
            {!profile?.leetcodeUsername && (
              <Link to="/profile" className="text-sm text-primary hover:text-blue-800 flex items-center gap-1 font-medium transition-colors">Connect <ArrowRight className="w-4 h-4" /></Link>
            )}
          </div>

          {leetcodeStats ? (
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center"><p className="text-green-600 font-medium text-xs">Easy</p><p className="text-lg font-bold text-slate-900">{leetcodeStats.easySolved}</p></div>
                <div className="text-center"><p className="text-yellow-600 font-medium text-xs">Medium</p><p className="text-lg font-bold text-slate-900">{leetcodeStats.mediumSolved}</p></div>
                <div className="text-center"><p className="text-red-600 font-medium text-xs">Hard</p><p className="text-lg font-bold text-slate-900">{leetcodeStats.hardSolved}</p></div>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-500 font-medium text-xs">Contest Rating</p>
                  <p className="text-xl font-bold text-slate-900">{leetcodeStats.contestRating || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 font-medium text-xs">Global Rank</p>
                  <p className="text-lg font-bold text-primary">#{leetcodeStats.globalRanking || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-300 border-dashed">
              <p className="text-slate-500">Connect your LeetCode to see your DSA skills.</p>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
