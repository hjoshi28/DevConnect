import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, Bell, LogIn, LogOut, Menu, Sparkles } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">DevConnect<span className="text-primary">AI</span></span>
            </Link>

            {user && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link to="/dashboard" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                  <Link to="/network" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Network</Link>
                  <Link to="/jobs" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 text-sm font-medium"><Briefcase className="w-4 h-4" /> Jobs</Link>
                  <Link to="/projects" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 text-sm font-medium"><Briefcase className="w-4 h-4" /> Showcase</Link>
                  <Link to="/intelligence" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 text-sm font-medium"><Sparkles className="w-4 h-4" /> AI Engine</Link>
                  <Link to="/profile" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 text-sm font-medium"><User className="w-4 h-4" /> Profile</Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              {user ? (
                <>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link to="/register" className="bg-primary hover:bg-blue-800 text-white shadow-md px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 focus:outline-none transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                <Link to="/network" className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Network</Link>
                <Link to="/jobs" className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Jobs</Link>
                {user.role !== 'recruiter' && (
                  <Link to="/applications" className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">My Applications</Link>
                )}
                <Link to="/profile" className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                <Link to="/register" className="text-primary hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
