import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Briefcase, MapPin, Building, DollarSign, Calendar, List } from 'lucide-react';

const JobFormModal = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    requiredSkills: '',
    salaryRange: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        companyName: job.companyName || '',
        description: job.description || '',
        location: job.location || '',
        employmentType: job.employmentType || 'Full-time',
        experienceLevel: job.experienceLevel || 'Mid-level',
        requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
        salaryRange: job.salaryRange || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (job) {
        await axios.put(`/api/jobs/${job._id}`, formData);
      } else {
        await axios.post('/api/jobs', formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            {job ? 'Edit Job Posting' : 'Post a New Job'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g. Remote, or New York, NY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g. $100k - $120k"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type *</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills (comma separated)</label>
                <div className="relative">
                  <List className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g. React, Node.js, TypeScript"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
              <textarea
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                placeholder="Describe the role, responsibilities, and requirements..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (job ? 'Update Job' : 'Post Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
