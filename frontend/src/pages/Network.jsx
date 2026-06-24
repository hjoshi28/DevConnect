import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Search, MessageSquare, Star, MapPin, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Network = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [activeTab, setActiveTab] = useState('network'); // 'network' | 'candidates'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const res = await axios.get('/api/network/users');
        setUsers(res.data);

        if (user?.role === 'recruiter' || user?.role === 'admin') {
          const candRes = await axios.get('/api/network/candidates');
          setCandidates(candRes.data);
        }
      } catch (error) {
        console.error('Error fetching network:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNetwork();
  }, [user]);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading network...</div>;

  const currentList = activeTab === 'candidates' ? candidates : users;

  const filteredProfiles = currentList.filter(profile => {
    const name = profile.user?.name || '';
    const bio = profile.bio || '';
    
    const matchesName = name.toLowerCase().includes(searchName.toLowerCase()) || 
                        bio.toLowerCase().includes(searchName.toLowerCase());
    
    if (!searchSkill) return matchesName;
    
    const hasSkill = (profile.skills || []).some(skill => 
      (skill || '').toLowerCase().includes(searchSkill.toLowerCase())
    );
    return matchesName && hasSkill;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Community Network</h1>
            <p className="text-slate-500 mt-1">Connect with developers and find your next opportunity.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full sm:w-56 bg-white border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by skill..." 
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              className="w-full sm:w-56 bg-white border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      {(user?.role === 'recruiter' || user?.role === 'admin') && (
        <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-2 font-medium ${activeTab === 'network' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All Members
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'candidates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Star className="w-4 h-4" /> Top Candidates
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map(profile => (
          <div key={profile._id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:border-blue-300 hover:shadow-md shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${profile.user._id}`} className="shrink-0 hover:opacity-80 transition-opacity">
                  {profile.user?.avatar ? (
                    <img src={profile.user.avatar} alt={profile.user.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 border-2 border-slate-200">
                      {profile.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </Link>
                <div>
                  <Link to={`/profile/${profile.user._id}`} className="hover:text-blue-800 transition-colors">
                    <h3 className="text-lg font-bold text-slate-900">{profile.user?.name}</h3>
                  </Link>
                  <p className="text-sm text-primary">{profile.role === 'recruiter' ? 'Recruiter' : profile.bio || 'Developer'}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {profile.location || 'Remote'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{profile.about || 'No description provided.'}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.skills || []).slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-medium">
                    {skill}
                  </span>
                ))}
                {(profile.skills?.length || 0) > 3 && <span className="px-2 py-1 text-xs text-slate-500">+{profile.skills.length - 3}</span>}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 flex gap-3">
              <button 
                onClick={() => navigate('/chat/' + profile.user._id)}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" /> Message
              </button>
            </div>
          </div>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;
