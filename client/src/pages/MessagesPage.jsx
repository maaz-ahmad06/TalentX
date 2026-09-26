import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  User, 
  CheckCheck, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Briefcase,
  Layers,
  Award,
  MessageSquare,
  ArrowLeft,
  LogOut,
  Building2,
  Users,
  Lock,
  Settings,
  Search
} from 'lucide-react';

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

export const MessagesPage = ({ 
  messages = [], 
  onSendMessage, 
  talents = [], 
  contracts = [],
  proposals = [],
  jobs = [],
  currentUser = null,
  onLogout,
  onHireTalent 
}) => {
  const [selectedTalent, setSelectedTalent] = useState(talents[0] || null);
  const [inputText, setInputText] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the messages list when messages update or when changing talent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedTalent]);

  const quickReplies = [
    'Salam! Are you available for a shoot this weekend?',
    'Can you share your portfolio drive link?',
    'Our budget is fixed at PKR 45,000 for this scope.',
    'Yes, we can arrange an on-site meeting in Gulberg.'
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedTalent) return;

    const senderName = currentUser?.name || 'Client Business';
    const isClient = currentUser?.role === 'client' || !currentUser;

    onSendMessage({
      senderId: currentUser?.id || 'client_01',
      senderName: senderName,
      receiverId: selectedTalent.id,
      text: inputText,
      isClient: isClient
    });

    setInputText('');

    // Simulated instant reply
    setTimeout(() => {
      const autoResponses = [
        `Walaikum Assalam! Thank you for reaching out. Yes, I'm fully available for this project in ${selectedTalent.city || 'Pakistan'}.`,
        `Sounds great! I have reviewed the requirements and I can deliver the first milestone within 48 hours.`,
        `I am happy to collaborate on this budget. Please send over the contract offer so we can lock the schedule.`
      ];
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      
      onSendMessage({
        senderId: selectedTalent.id,
        senderName: selectedTalent.name,
        receiverId: currentUser?.id || 'client_01',
        text: randomResponse,
        isClient: !isClient
      });
    }, 1200);
  };

  const filteredTalents = talents.filter(t => 
    t.name.toLowerCase().includes(threadSearch.toLowerCase()) ||
    (t.city && t.city.toLowerCase().includes(threadSearch.toLowerCase()))
  );

  // Core Chat Workspace Component
  const ChatWorkspace = () => (
    <div className="flex h-full w-full rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden backdrop-blur-2xl shadow-2xl">
      {/* Left Column: Conversations List */}
      <div className="w-80 bg-slate-950/60 border-r border-white/10 flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Direct Conversations</h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            Live
          </span>
        </div>

        <div className="p-3 border-b border-white/5">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-slate-500 pointer-events-none" />
            <input 
              type="text" 
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
              placeholder="Search conversations..."
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTalents.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs">
              No matching conversations found.
            </div>
          ) : (
            filteredTalents.map((t) => (
              <div 
                key={t.id} 
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  selectedTalent?.id === t.id 
                    ? 'bg-indigo-600/20 border border-indigo-500/40 shadow-md' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                onClick={() => setSelectedTalent(t)}
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <img src={t.avatar || FALLBACK_AVATAR} alt={t.name} className="w-full h-full rounded-full object-cover border border-white/10" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{t.name}</span>
                    <span className="text-[10px] font-semibold text-emerald-400">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.headline || 'Professional Specialist'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/80 min-w-0">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={selectedTalent?.avatar || FALLBACK_AVATAR} 
              alt={selectedTalent?.name || 'User'} 
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-md" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">{selectedTalent?.name || 'TalentX Specialist'}</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} /> {selectedTalent?.city || 'Pakistan'} &bull; PKR {Number(selectedTalent?.hourlyRate || 3500).toLocaleString()}/hr
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onHireTalent && selectedTalent && (
              <button 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                onClick={() => onHireTalent(selectedTalent)}
              >
                <Sparkles size={13} />
                <span>Send Hire Offer</span>
              </button>
            )}
            {selectedTalent && (
              <Link 
                to={`/profile/${selectedTalent.id}`} 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-all"
              >
                <span>View Portfolio</span>
              </Link>
            )}
          </div>
        </div>

        {/* Messages Feed (Independent Scroll Container) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <MessageSquare size={24} />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Start the Conversation</h4>
              <p className="text-slate-400 text-xs max-w-xs">Send a direct inquiry regarding your project milestone or availability.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.isClient ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[75%] sm:max-w-[65%] shadow-lg ${
                  msg.isClient 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-indigo-500/20' 
                    : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none'
                }`}>
                  <div className="text-[10px] font-bold opacity-75 mb-1">{msg.senderName}</div>
                  <p className="m-0 text-xs sm:text-sm">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] opacity-60 mt-1.5">
                    <span>{msg.time}</span>
                    {msg.isClient && <CheckCheck size={12} className="text-cyan-300" />}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Pills Strip */}
        <div className="flex gap-2 p-3 px-6 overflow-x-auto bg-slate-900/60 border-t border-white/5 flex-shrink-0">
          {quickReplies.map((qr, i) => (
            <button 
              key={i} 
              type="button"
              className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              onClick={() => setInputText(qr)}
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 px-6 bg-slate-900 border-t border-white/10 flex items-center gap-3 flex-shrink-0">
          <input 
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
            placeholder={`Message ${selectedTalent?.name || 'freelancer'}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            type="submit" 
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex-shrink-0"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );

  // If user is LOGGED IN, embed within their Dedicated Dashboard Shell with Sidebar!
  if (currentUser) {
    const isClient = currentUser.role === 'client';
    const isAdmin = currentUser.role === 'admin';

    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans w-full">
        {/* Left Sticky Sidebar */}
        <aside className="w-72 bg-slate-900/90 border-r border-white/10 p-6 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto backdrop-blur-2xl flex-shrink-0 z-30">
          <div className="space-y-6">
            {/* Brand Section */}
            <div className="pb-4 border-b border-white/5">
              <Link to="/" className="flex items-center gap-3 no-underline group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                  <span>X</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-white">TalentX</span>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isAdmin ? 'text-amber-400' : isClient ? 'text-indigo-400' : 'text-purple-400'}`}>
                    {isAdmin ? 'ADMIN HUB' : isClient ? 'EMPLOYER HUB' : 'TALENT WORKSPACE'}
                  </span>
                </div>
              </Link>
            </div>

            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
              <img 
                src={currentUser?.avatar || FALLBACK_AVATAR} 
                alt={currentUser?.name} 
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-md"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm text-white truncate">{currentUser?.name || 'User'}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-amber-400' : isClient ? 'text-indigo-400' : 'text-purple-400'}`}>
                  {isAdmin ? 'Super Admin' : isClient ? 'Client Employer' : 'Verified Pro'}
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5">
              <div className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase px-3 mb-2">
                {isAdmin ? 'ADMINISTRATION' : isClient ? 'EMPLOYER WORKSPACE' : 'FREELANCER HUB'}
              </div>

              {isAdmin ? (
                <>
                  <Link to="/admin" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Users size={18} /><span>User Management</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{talents.length}</span>
                  </Link>
                  <Link to="/admin" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Briefcase size={18} /><span>Job Moderation</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{jobs.length}</span>
                  </Link>
                  <Link to="/admin" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Lock size={18} /><span>Escrow Ledger</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{contracts.length}</span>
                  </Link>
                  <Link to="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Settings size={18} /><span>Governance & Settings</span>
                  </Link>
                </>
              ) : isClient ? (
                <>
                  <Link to="/dashboard/client" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Briefcase size={18} /><span>Active Contracts</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{contracts.length}</span>
                  </Link>
                  <Link to="/dashboard/client" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Building2 size={18} /><span>My Posted Jobs</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{jobs.length}</span>
                  </Link>
                  <Link to="/dashboard/client" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Users size={18} /><span>Received Bids</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{proposals.length}</span>
                  </Link>
                  <Link to="/dashboard/client" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <User size={18} /><span>Company Settings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard/freelancer" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Briefcase size={18} /><span>Active Contracts</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{contracts.length}</span>
                  </Link>
                  <Link to="/dashboard/freelancer" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3"><Layers size={18} /><span>Submitted Bids</span></div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">{proposals.length}</span>
                  </Link>
                  <Link to="/dashboard/freelancer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Award size={18} /><span>Showcase Portfolio</span>
                  </Link>
                  <Link to="/dashboard/freelancer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <User size={18} /><span>Profile & Skills</span>
                  </Link>
                </>
              )}

              {/* Active Messages Link */}
              <Link to="/messages" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
                <MessageSquare size={18} />
                <span>Messages & Chat</span>
              </Link>
            </nav>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="pt-6 border-t border-white/5 space-y-2">
            <Link to="/" className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all">
              <ArrowLeft size={16} />
              <span>Return to Marketplace</span>
            </Link>

            {onLogout && (
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer" onClick={onLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-slate-950">
          {/* Topbar */}
          <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-2.5 text-sm">
              <span className="text-slate-500 font-medium">
                {isAdmin ? 'Admin Portal' : isClient ? 'Employer Workspace' : 'Talent Workspace'}
              </span>
              <span className="text-slate-700">/</span>
              <span className="font-bold text-white">Live Direct Messages & Chat</span>
            </div>

            <Link 
              to={isClient ? "/dashboard/client" : isAdmin ? "/admin" : "/dashboard/freelancer"} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-all"
            >
              <span>Back to Dashboard</span>
            </Link>
          </header>

          {/* Chat Container embedded seamlessly in dashboard */}
          <div className="flex-1 p-6 overflow-hidden">
            <ChatWorkspace />
          </div>
        </div>
      </div>
    );
  }

  // Fallback for Public / Guest Mode
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-100px)]">
      <ChatWorkspace />
    </div>
  );
};
