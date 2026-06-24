import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Briefcase, Activity, ShieldCheck, Sparkles, Search, Layers, MessageSquare } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-primary font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Placement Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Crack Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Tech Placement</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            DevConnect AI analyzes your GitHub, LeetCode, and Resume to give you a personalized placement readiness score and roadmap to top tier companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-200 shadow-sm">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to stand out</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Stop guessing what recruiters want. Our AI engine tells you exactly what skills to learn and which projects to build.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Unified Portfolios', desc: 'Connect GitHub & LeetCode to automatically build a stunning developer portfolio with real-time stats.', icon: Code, color: 'text-blue-600', bg: 'bg-blue-100' },
              { title: 'AI Intelligence Engine', desc: 'Get ATS match scores, formatting suggestions, and actionable skill gap analysis for target roles.', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { title: 'Advanced Sourcing', desc: 'Instantly filter our entire talent network by specific technical skills, location, or experience.', icon: Search, color: 'text-indigo-600', bg: 'bg-indigo-100' },
              { title: 'Project Showcase', desc: 'Publish your side projects to a community feed, get feedback, and discover what others are building.', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-100' },
              { title: 'Real-time Messaging', desc: 'Connect directly with recruiters, alumni, and top developers via instant chat.', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
              { title: 'Jobs Portal', desc: 'Browse open positions, submit applications with one click, and track your hiring status in real-time.', icon: Briefcase, color: 'text-primary', bg: 'bg-blue-100' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-blue-300 hover:shadow-md shadow-sm transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg text-slate-700">DevConnectAI</span>
        </div>
        <p>© 2026 DevConnect AI. Designed for ambitious developers.</p>
      </footer>
    </div>
  );
};

export default Landing;
