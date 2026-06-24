import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, Search, Filter, Plus, Clock, Building } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import JobFormModal from './JobFormModal';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingJob(null);
    setIsModalOpen(false);
  };

  const handleJobSaved = () => {
    fetchJobs();
    handleCloseModal();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesSkills = skillFilter ? job.requiredSkills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase())) : true;
    
    // If recruiter, only show their own jobs for management. 
    // Wait, let recruiters see all jobs but mark theirs, or just filter to their jobs?
    // Let's show all jobs, but maybe recruiters only care about theirs. Let's just show all jobs for now.
    
    return matchesSearch && matchesLocation && matchesSkills;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-primary" />
            Job Board
          </h1>
          <p className="text-slate-500 mt-2">Find your next role or discover top talent.</p>
        </div>
        
        {user?.role === 'recruiter' && (
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post a Job
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by title or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Filter by location..." 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Filter by skill (e.g. React)..." 
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No jobs found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <Link 
              key={job._id} 
              to={`/jobs/${job._id}`}
              className="block bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-slate-600 font-medium">
                    <Building className="w-4 h-4" /> {job.companyName}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.employmentType}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.experienceLevel}</span>
                    {job.salaryRange && <span className="flex items-center gap-1 text-green-600 font-medium">{job.salaryRange}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.requiredSkills.slice(0, 5).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 text-slate-700 rounded-md text-xs border border-slate-200 font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-md text-xs border border-slate-200 font-medium">
                        +{job.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm border border-blue-100 group-hover:bg-primary group-hover:text-white transition-colors">
                    View Details
                  </div>
                  <span className="text-xs text-slate-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <JobFormModal 
          job={editingJob} 
          onClose={handleCloseModal} 
          onSave={handleJobSaved} 
        />
      )}
    </div>
  );
};

export default Jobs;
