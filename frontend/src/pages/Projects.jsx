import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GitBranch, ExternalLink, Star, Eye, Code, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveDemoLink: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to add a project');

    setIsSubmitting(true);
    try {
      // Sending as standard JSON since we aren't uploading files in this phase
      const res = await axios.post('/api/projects', formData);

      // The backend returns a project with a string user ID. 
      // To prevent it looking broken on the UI before refresh, we can attach the user object locally.
      const newProject = {
        ...res.data,
        user: { _id: user._id, name: user.name, avatar: user.avatar }
      };

      setProjects([newProject, ...projects]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', techStack: '', githubLink: '', liveDemoLink: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to add project');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleLikeProject = async (projectId) => {
    if (!user) return alert('Please login to like projects');
    try {
      const res = await axios.post(`/api/projects/${projectId}/like`);
      // Update the projects array with the updated project data
      setProjects(projects.map(p => p._id === projectId ? res.data : p));
    } catch (error) {
      console.error('Error liking project', error);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading projects...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Project Showcase</h1>
          <p className="text-slate-500 mt-1">Discover top projects built by developers in the community.</p>
        </div>
        {user && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" /> Add Project
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title*</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description*</label>
                <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack (comma separated)*</label>
                <input required type="text" name="techStack" value={formData.techStack} onChange={handleInputChange} placeholder="React, Node.js, MongoDB" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Link</label>
                  <input type="url" name="githubLink" value={formData.githubLink} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Live Demo Link</label>
                  <input type="url" name="liveDemoLink" value={formData.liveDemoLink} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-blue-800 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                  {isSubmitting ? 'Publishing...' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map((project, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={project._id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md shadow-sm transition-all"
          >
            <div className="h-48 bg-slate-50 relative">
              {project.images && project.images.length > 0 ? (
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Code className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Link to={`/profile/${project.user._id}`} className="shrink-0 hover:opacity-80 transition-opacity">
                  {project.user?.avatar ? (
                    <img src={project.user.avatar} alt={project.user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                      {project.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </Link>
                <div>
                  <Link to={`/profile/${project.user._id}`} className="hover:text-blue-800 transition-colors">
                    <h3 className="font-medium text-slate-900">{project.user?.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-700 rounded border border-slate-200 font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-slate-500">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLikeProject(project._id)}
                    className={`flex items-center gap-1 transition-colors ${project.metrics?.likes?.includes(user?._id) ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
                  >
                    <Star className={`w-4 h-4 ${project.metrics?.likes?.includes(user?._id) ? 'fill-yellow-500' : ''}`} /> 
                    <span className="text-sm">{project.metrics?.likes?.length || 0}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> <span className="text-sm">{project.metrics?.views || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      <GitBranch className="w-5 h-5" />
                    </a>
                  )}
                  {project.liveDemoLink && (
                    <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-20 text-slate-500">
            No projects found. Be the first to share your work!
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
