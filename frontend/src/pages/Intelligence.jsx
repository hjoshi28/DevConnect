import { useState, useContext } from 'react';
import axios from 'axios';
import { Sparkles, Upload, FileText, Target, AlertCircle, CheckCircle, ChevronRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Intelligence = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !targetRole) {
      setError('Please provide both a resume and a target role.');
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const res = await axios.post('/api/ai/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAnalysis(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl border border-blue-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Placement Intelligence</h1>
          <p className="text-gray-400 mt-1">AI-powered resume analysis and skill gap detection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface p-6 rounded-2xl border border-gray-800 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Analyze Resume
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Role</label>
                <div className="relative">
                  <Target className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="e.g. Frontend Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Upload Resume (PDF)</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative bg-gray-900">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  {file ? (
                    <p className="text-sm font-medium text-primary truncate px-2">{file.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file || !targetRole}
                className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Analyzing with AI...' : 'Generate Intelligence'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-800" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${analysis.readinessScore * 2.51} 251`} className="text-blue-500 transition-all duration-1000" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-white">{analysis.readinessScore}%</span>
                    </div>
                  </div>
                  <h3 className="mt-4 font-bold text-white">Readiness Score</h3>
                  <p className="text-xs text-gray-400 mt-1">Match for {targetRole}</p>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-800" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${analysis.atsScore * 2.51} 251`} className="text-emerald-500 transition-all duration-1000" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-white">{analysis.atsScore}%</span>
                    </div>
                  </div>
                  <h3 className="mt-4 font-bold text-white">ATS Score</h3>
                  <p className="text-xs text-gray-400 mt-1">Parsing & Keywords</p>
                </div>
              </div>

              {/* Feedback Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-900/20 border border-green-500/20 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Strengths</h3>
                  <ul className="space-y-3">
                    {analysis.strengths.map((str, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-500/20 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Weaknesses</h3>
                  <ul className="space-y-3">
                    {analysis.weaknesses.map((weak, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        {weak}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Formatting & Impact</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{analysis.formattingFeedback}</p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Missing ATS Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400" /> Recommended Projects to Boost Profile</h3>
                <ul className="space-y-4">
                  {analysis.recommendedProjects.map((proj, i) => (
                    <li key={i} className="bg-surface/50 p-4 rounded-xl border border-indigo-500/20 text-gray-300 text-sm leading-relaxed">
                      {proj}
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-surface/50">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock AI Insights</h3>
              <p className="text-gray-400 max-w-md">Upload your resume and target role to get instant feedback on how to improve your chances of getting shortlisted.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
