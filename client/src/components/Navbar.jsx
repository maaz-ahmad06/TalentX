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
  LogOut
} from 'lucide-react';

export const Navbar = ({ 
  currentUser = null, 
  onLogout, 
  onOpenAuth,
  unreadCount = 1 
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <span>X</span>
            <div className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-md -z-10 group-hover:bg-indigo-500/40 transition-colors"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center leading-none">
              Talent<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">X</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">PAKISTAN LOCAL</span>
          </div>
        </Link>

        {/* Navigation Links */}
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

        {/* Right Actions: Post Job CTA & User Auth */}
        <div className="flex items-center gap-3">
          {/* Post a Job Button — ONLY visible when logged in as a Client/Employer */}
          {currentUser?.role === 'client' && (
            <Link 
              to="/post-job" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={15} />
              <span>Post a Job</span>
            </Link>
          )}

          {/* User Auth / Profile Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 p-1.5 pr-2.5 rounded-full backdrop-blur-md transition-all shadow-md">
              <Link 
                to={currentUser.role === 'client' ? '/dashboard/client' : currentUser.role === 'admin' ? '/admin' : '/dashboard/freelancer'}
                className="flex items-center gap-2.5 no-underline group"
                title="Go to Your Dashboard"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500 group-hover:scale-105 transition-transform" 
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {currentUser.role === 'client' ? 'Employer' : currentUser.role === 'admin' ? 'Admin' : 'Freelancer'}
                  </span>
                </div>
              </Link>
              <button 
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all ml-1 cursor-pointer"
                onClick={onLogout} 
                title="Log Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              onClick={onOpenAuth}
            >
              <User size={15} />
              <span>Log In / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
