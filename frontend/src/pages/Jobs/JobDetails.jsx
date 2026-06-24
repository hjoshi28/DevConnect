import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, Building, DollarSign, Clock, Calendar, ArrowLeft, Send, Users, Edit, Trash2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import JobFormModal from './JobFormModal';
import Applicants from './Applicants';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [viewingApplicants, setViewingApplicants] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        navigate('/jobs');
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError(null);

    try {
      await axios.post(`/api/applications/${id}`, { coverLetter });
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
        setCoverLetter('');
      }, 2000);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!job) return (
    <div className="text-center py-20 text-red-500">Job not found</div>
  );

  const isOwner = user?.role === 'recruiter' && job.recruiter?._id === user?._id;

  if (viewingApplicants && isOwner) {
    return <Applicants jobId={id} onBack={() => setViewingApplicants(false)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-lg text-primary font-medium">
                <Building className="w-5 h-5" /> {job.companyName}
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              {isOwner ? (
                <>
                  <button onClick={() => setViewingApplicants(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors border border-indigo-200">
                    <Users className="w-4 h-4" /> Applicants
                  </button>
                  <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-slate-500 hover:text-primary bg-white border border-slate-200 hover:border-primary rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={handleDelete} className="p-2 text-red-500 hover:text-red-700 bg-white border border-slate-200 hover:border-red-300 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                user?.role !== 'recruiter' && (
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm transition-all"
                  >
                    <Send className="w-5 h-5" /> Apply Now
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Briefcase className="w-5 h-5 text-slate-400" />
              <span className="font-medium">{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="font-medium">{job.experienceLevel}</span>
            </div>
            {job.salaryRange && (
              <div className="flex items-center gap-2 text-green-600">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="font-medium">{job.salaryRange}</span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About the Role</h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm border border-slate-200 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-slate-500">
            <p>Posted by {job.recruiter?.name} on {new Date(job.createdAt).toLocaleDateString()}</p>
            {job.deadline && (
              <p className="flex items-center gap-1 mt-2 md:mt-0 text-amber-600 font-medium">
                <Calendar className="w-4 h-4" /> Apply before: {new Date(job.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <JobFormModal 
          job={job} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={() => {
            setIsEditModalOpen(false);
            fetchJob();
          }} 
        />
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Apply for {job.title}</h2>
            <p className="text-slate-500 mb-6 text-sm">at {job.companyName}</p>
            
            {applySuccess ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 text-center font-medium">
                Application submitted successfully! Good luck.
              </div>
            ) : (
              <form onSubmit={handleApply}>
                {applyError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                    {applyError}
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter (Optional)</label>
                  <textarea
                    rows="6"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                    placeholder="Tell the recruiter why you're a great fit for this role..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {applyLoading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Application</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
