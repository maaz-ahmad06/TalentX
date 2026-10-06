import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  User, 
  MessageSquare, 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronDown, 
  Building2, 
  Sliders, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({ 
  currentUser = null, 
  onLogout, 
  onOpenAuth,
  unreadCount = 0 
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0" onClick={closeMobileMenu}>
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xl sm:text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <span>X</span>
            <div className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-md -z-10 group-hover:bg-indigo-500/40 transition-colors"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center leading-none">
              Talent<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">X</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">PAKISTAN LOCAL</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/70 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <NavLink 
            to="/talents" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Users size={16} />
            <span>Find Talent</span>
          </NavLink>

          <NavLink 
            to="/jobs" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Briefcase size={16} />
            <span>Browse Jobs</span>
          </NavLink>

          <NavLink 
            to="/ai-match" 
            className={({ isActive }) => 
              `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20' 
                  : 'text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40'
              }`
            }
          >
            <Sparkles size={16} className="text-purple-400 animate-pulse" />
            <span>AI Matcher</span>
            <span className="px-1.5 py-0.2 rounded-md bg-purple-500/30 text-purple-200 text-[10px] font-extrabold uppercase">AI</span>
          </NavLink>

          {/* Direct Dashboard Link — Only shown when user is Logged In */}
          {currentUser && (
            <NavLink 
              to={currentUser.role === 'client' ? '/dashboard/client' : currentUser.role === 'admin' ? '/admin' : '/dashboard/freelancer'} 
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>
          )}

          {/* Messages Link — Only visible when logged in */}
          {currentUser && (
            <NavLink 
              to="/messages" 
              className={({ isActive }) => 
                `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="relative">
                <MessageSquare size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900"></span>
                )}
              </div>
              <span>Messages</span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions: Post Job CTA, User Auth & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Post a Job Button — ONLY visible when logged in as a Client/Employer */}
          {currentUser?.role === 'client' && (
            <Link 
              to="/post-job" 
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={15} />
              <span>Post a Job</span>
            </Link>
          )}

          {/* User Auth / Profile Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 p-1 sm:p-1.5 sm:pr-2.5 rounded-full backdrop-blur-md transition-all shadow-md">
              <Link 
                to={currentUser.role === 'client' ? '/dashboard/client' : currentUser.role === 'admin' ? '/admin' : '/dashboard/freelancer'}
                className="flex items-center gap-2 no-underline group"
                title="Go to Your Dashboard"
                onClick={closeMobileMenu}
              >
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500 group-hover:scale-105 transition-transform" 
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {currentUser.role === 'client' ? 'Employer' : currentUser.role === 'admin' ? 'Admin' : 'Freelancer'}
                  </span>
                </div>
              </Link>
              <button 
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all ml-0.5 sm:ml-1 cursor-pointer"
                onClick={onLogout} 
                title="Log Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              onClick={onOpenAuth}
            >
              <User size={14} />
              <span>Log In</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-white/10 backdrop-blur-2xl px-5 py-6 space-y-4 animate-fadeIn shadow-2xl">
          <nav className="space-y-2">
            <NavLink 
              to="/talents" 
              onClick={closeMobileMenu}
              className={({ isActive }) => 
                `flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition-colors ${
                  isActive ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-indigo-400" />
                <span>Find Talent</span>
              </div>
              <ChevronDown size={14} className="-rotate-90 text-slate-500" />
            </NavLink>

            <NavLink 
              to="/jobs" 
              onClick={closeMobileMenu}
              className={({ isActive }) => 
                `flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition-colors ${
                  isActive ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-purple-400" />
                <span>Browse Jobs</span>
              </div>
              <ChevronDown size={14} className="-rotate-90 text-slate-500" />
            </NavLink>

            <NavLink 
              to="/ai-match" 
              onClick={closeMobileMenu}
              className={({ isActive }) => 
                `flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition-colors ${
                  isActive ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-pink-400 animate-pulse" />
                <span>AI Candidate Matcher</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 text-[10px] font-black">AI</span>
            </NavLink>

            {currentUser && (
              <>
                <NavLink 
                  to={currentUser.role === 'client' ? '/dashboard/client' : currentUser.role === 'admin' ? '/admin' : '/dashboard/freelancer'} 
                  onClick={closeMobileMenu}
                  className={({ isActive }) => 
                    `flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition-colors ${
                      isActive ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} className="text-emerald-400" />
                    <span>My Dashboard ({currentUser.role === 'client' ? 'Client' : currentUser.role === 'admin' ? 'Admin' : 'Freelancer'})</span>
                  </div>
                  <ChevronDown size={14} className="-rotate-90 text-slate-500" />
                </NavLink>

                <NavLink 
                  to="/messages" 
                  onClick={closeMobileMenu}
                  className={({ isActive }) => 
                    `flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition-colors ${
                      isActive ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-indigo-400" />
                    <span>Messages & Chat</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </>
            )}

            {currentUser?.role === 'client' && (
              <Link 
                to="/post-job" 
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20"
              >
                <PlusCircle size={16} />
                <span>Post a New Project</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
