import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ShieldCheck, Heart, Mail, Phone } from 'lucide-react';
import { CITIES } from '../data/mockData';

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-container">
        {/* Top Grid */}
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <div className="logo-icon-wrap">
                <span className="logo-x">X</span>
              </div>
              <div className="brand-text">
                <span className="brand-title">Talent<span className="text-gradient">X</span></span>
                <span className="brand-tag">PAKISTAN LOCAL MARKETPLACE</span>
              </div>
            </Link>
            <p className="footer-brand-desc">
              Pakistan's first AI-powered local talent network. Connecting businesses with verified local developers, designers, fashion photographers, video editors, and marketers.
            </p>
            <div className="footer-trust-pill">
              <ShieldCheck size={16} className="text-emerald" />
              <span>100% Safe Local Milestone Escrow</span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Marketplace</h4>
            <ul className="footer-nav-list">
              <li><Link to="/talents">Explore Local Talents</Link></li>
              <li><Link to="/jobs">Find Work & Jobs</Link></li>
              <li><Link to="/ai-match">AI Smart Matcher</Link></li>
              <li><Link to="/post-job">Post a Project</Link></li>
              <li><Link to="/talents?cat=Photography">Fashion Photographers</Link></li>
              <li><Link to="/talents?cat=Web+Development">MERN Full-Stack Devs</Link></li>
            </ul>
          </div>

          {/* Portals & Dashboards */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Portals & Workspaces</h4>
            <ul className="footer-nav-list">
              <li><Link to="/dashboard/client">🏢 Client / Business Portal</Link></li>
              <li><Link to="/dashboard/freelancer">🧑‍💻 Freelancer Career Hub</Link></li>
              <li><Link to="/admin">🛡️ Admin Command Center</Link></li>
              <li><Link to="/messages">💬 Live Chat Suite</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Top Cities</h4>
            <div className="footer-cities-chips">
              {CITIES.filter(c => c !== 'All Cities').map(city => (
                <Link key={city} to={`/talents?city=${city}`} className="city-chip-link">
                  <MapPin size={11} /> {city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} TalentX Pakistan. Built for NAVTTC / AKTI Full-Stack MERN Demonstration.
          </p>
          <div className="footer-legal-links">
            <span>Payment Methods: JazzCash &bull; EasyPaisa &bull; Local Bank Wire</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
