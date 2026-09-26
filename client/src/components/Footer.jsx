import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ShieldCheck, Heart, Mail, Phone } from 'lucide-react';
import { CITIES } from '../data/mockData';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 pt-16 pb-8 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30">
                <span>X</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Talent<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">X</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">PAKISTAN LOCAL MARKETPLACE</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pakistan's first AI-powered local talent network. Connecting businesses with verified local developers, designers, fashion photographers, video editors, and marketers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck size={16} />
              <span>100% Safe Local Milestone Escrow</span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/talents" className="hover:text-indigo-400 transition-colors">Explore Local Talents</Link></li>
              <li><Link to="/jobs" className="hover:text-indigo-400 transition-colors">Find Work & Jobs</Link></li>
              <li><Link to="/ai-match" className="hover:text-indigo-400 transition-colors">AI Smart Matcher</Link></li>
              <li><Link to="/post-job" className="hover:text-indigo-400 transition-colors">Post a Project</Link></li>
              <li><Link to="/talents?cat=Photography" className="hover:text-indigo-400 transition-colors">Fashion Photographers</Link></li>
              <li><Link to="/talents?cat=Web+Development" className="hover:text-indigo-400 transition-colors">MERN Full-Stack Devs</Link></li>
            </ul>
          </div>

          {/* Portals & Dashboards */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Portals & Workspaces</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard/client" className="hover:text-indigo-400 transition-colors">🏢 Client / Business Portal</Link></li>
              <li><Link to="/dashboard/freelancer" className="hover:text-indigo-400 transition-colors">🧑‍💻 Freelancer Career Hub</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">🛡️ Admin Command Center</Link></li>
              <li><Link to="/messages" className="hover:text-indigo-400 transition-colors">💬 Live Chat Suite</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Top Pakistani Cities</h4>
            <div className="flex flex-wrap gap-2">
              {CITIES.filter(c => c !== 'All Cities').map(city => (
                <Link 
                  key={city} 
                  to={`/talents?city=${city}`} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-300 text-xs font-medium transition-all"
                >
                  <MapPin size={11} className="text-indigo-400" /> {city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} TalentX Pakistan. Built for NAVTTC / AKTI Full-Stack MERN Demonstration.
          </p>
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span>Payment Methods: JazzCash &bull; EasyPaisa &bull; Local Bank Wire</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
