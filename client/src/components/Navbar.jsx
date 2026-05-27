import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Cpu, Compass, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel text-white sticky top-0 z-50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Home link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Cpu className="h-6 w-6 text-brand-400 group-hover:text-brand-300 transition-colors" />
              <span className="font-sans font-bold text-lg tracking-wide text-white group-hover:text-brand-200 transition-all">
                EduSphere<span className="text-brand-400 font-black">.</span>LMS
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex space-x-6 items-center">
              <Link 
                to="/" 
                className={`flex items-center space-x-1.5 text-sm font-semibold transition-all duration-200 px-3 py-1.5 border-b-2 ${
                  isActive('/') 
                    ? 'border-brand-500 text-brand-300' 
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/catalog" 
                className={`flex items-center space-x-1.5 text-sm font-semibold transition-all duration-200 px-3 py-1.5 border-b-2 ${
                  isActive('/catalog') 
                    ? 'border-brand-500 text-brand-300' 
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Catalog</span>
              </Link>
            </div>
          )}

          {/* User profile panel & Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2.5 border-l border-slate-800 pl-4">
                  <div className="hidden lg:block text-right">
                    <div className="text-xs text-slate-500 font-medium">Logged in as</div>
                    <div className="text-sm font-bold text-slate-200">{user.name}</div>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center font-semibold text-brand-300 text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-all duration-200 flex items-center justify-center"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-brand-600/15"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Links */}
      {user && (
        <div className="md:hidden border-t border-slate-850/50 flex justify-around py-2 bg-slate-950/80">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 text-xs py-1 ${
              isActive('/') ? 'text-brand-300' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/catalog" 
            className={`flex items-center space-x-1 text-xs py-1 ${
              isActive('/catalog') ? 'text-brand-300' : 'text-slate-400'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Catalog</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
