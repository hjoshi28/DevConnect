import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data);
      console.log('Login success', response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your placement intelligence dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-slate-300 bg-white rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-slate-300 bg-white rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 bg-white rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-blue-800">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-200 group-hover:text-white" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
