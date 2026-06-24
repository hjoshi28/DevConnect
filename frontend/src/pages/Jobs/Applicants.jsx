import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, FileText, CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';

const Applicants = ({ jobId, onBack }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`/api/applications/job/${jobId}`);
      setApplicants(res.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, { status: newStatus });
      fetchApplicants(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Interview Scheduled': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hired': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job Details
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Job Applicants</h1>
          <div className="px-4 py-1 bg-primary text-white rounded-full text-sm font-medium">
            {applicants.length} Total
          </div>
        </div>

        <div className="p-0">
          {applicants.length === 0 ? (
            <div className="text-center py-16">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No applicants yet</h3>
              <p className="text-slate-500 mt-2">When developers apply, they will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {applicants.map(app => (
                <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Applicant Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                        {app.applicant?.avatar ? (
                          <img src={app.applicant.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                            {app.applicant?.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link to={`/profile/${app.applicant?._id}`} className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          {app.applicant?.name}
                        </Link>
                        <p className="text-slate-500 text-sm">{app.applicant?.email}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg border font-medium text-sm outline-none cursor-pointer ${getStatusColor(app.status)}`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200 text-sm">
                      <div className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                        <FileText className="w-4 h-4 text-slate-400" /> Cover Letter
                      </div>
                      <p className="text-slate-600 whitespace-pre-wrap">{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
