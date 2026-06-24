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
    <nav className="bg-surface border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">DevConnect<span className="text-primary">AI</span></span>
            </Link>

            {user && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                  <Link to="/network" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Network</Link>
                  <Link to="/projects" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 px-3 py-2 text-sm font-medium"><Briefcase className="w-4 h-4" /> Showcase</Link>
                  <Link to="/intelligence" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 px-3 py-2 text-sm font-medium"><Sparkles className="w-4 h-4" /> AI Engine</Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              {user ? (
                <>
                  <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                    <Bell className="h-6 w-6" />
                  </button>
                  <button onClick={handleLogout} className="p-1 rounded-full text-red-400 hover:text-red-300 focus:outline-none" title="Logout">
                    <LogOut className="h-6 w-6" />
                  </button>
                  <div className="relative">
                    <Link to="/profile" className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-8 w-8 object-cover" />
                      ) : (
                        <User className="h-8 w-8 p-1 rounded-full bg-gray-700 text-gray-300" />
                      )}
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link to="/register" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-surface border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                <Link to="/register" className="text-primary hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
