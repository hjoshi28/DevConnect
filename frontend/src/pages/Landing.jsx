import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Briefcase, Activity, ShieldCheck, Sparkles } from 'lucide-react';
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
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-background to-surface">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Placement Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Crack Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Tech Placement</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            DevConnect AI analyzes your GitHub, LeetCode, and Resume to give you a personalized placement readiness score and roadmap to top tier companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="inline-flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-gray-700">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to stand out</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Stop guessing what recruiters want. Our AI engine tells you exactly what skills to learn and which projects to build.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Unified Profile', desc: 'Connect GitHub & LeetCode to automatically build a stunning developer portfolio.', icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { title: 'AI Resume Analysis', desc: 'Get ATS match scores, formatting suggestions, and tailored keywords for target companies.', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { title: 'Referral Marketplace', desc: 'Connect with alumni and employees at top companies to request referrals directly.', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/10' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-gray-700 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-gray-800 py-12 text-center text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="font-bold text-lg text-gray-400">DevConnectAI</span>
        </div>
        <p>© 2026 DevConnect AI. Designed for ambitious developers.</p>
      </footer>
    </div>
  );
};

export default Landing;
