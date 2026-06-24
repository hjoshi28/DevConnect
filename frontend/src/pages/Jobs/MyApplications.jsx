import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Building, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications/my-applications');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle className="w-8 h-8 text-primary" />
          My Applications
        </h1>
        <p className="text-slate-500 mt-2">Track the status of jobs you've applied for.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No applications yet</h3>
          <p className="text-slate-500 mt-2">You haven't applied to any jobs.</p>
          <Link to="/jobs" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div 
              key={app._id} 
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-1">
                <Link to={`/jobs/${app.job?._id}`} className="text-xl font-bold text-slate-900 hover:text-primary transition-colors">
                  {app.job?.title || 'Unknown Job'}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-slate-600 font-medium">
                  <Building className="w-4 h-4" /> {app.job?.companyName || 'Unknown Company'}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.job?.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    Job Status: 
                    <span className={`font-medium ${app.job?.status === 'Open' ? 'text-green-600' : 'text-red-500'}`}>
                      {app.job?.status}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className={`px-4 py-2 rounded-lg font-bold text-sm border ${getStatusColor(app.status)}`}>
                  Status: {app.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
