import React, { useState } from 'react';
import { 
  Send, 
  User, 
  CheckCheck, 
  Sparkles, 
  Paperclip, 
  Smile, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  Phone, 
  Video, 
  X 
} from 'lucide-react';

export const ChatDrawer = ({ 
  messages, 
  onSendMessage, 
  talents, 
  activeTalent = null, 
  onHireTalent 
}) => {
  const [selectedTalent, setSelectedTalent] = useState(activeTalent || talents[0]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'Salam! Are you available this weekend?',
    'Can you share your portfolio drive link?',
    'Our budget is fixed at PKR 45,000 for this scope.',
    'Yes, we can arrange an on-site meeting in Gulberg.'
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      senderId: 'client_01',
      senderName: 'Client Business',
      receiverId: selectedTalent.id,
      text: inputText,
      isClient: true
    });

    setInputText('');

    // Simulated Talent Auto-Reply after 1.2 seconds!
    setTimeout(() => {
      const autoResponses = [
        `Walaikum Assalam! Thank you for reaching out. Yes, I'm fully available for this project in ${selectedTalent.city}.`,
        `Sounds great! I have reviewed the brief and I can deliver the first revision within 48 hours.`,
        `I am happy to work with this budget. Please send over the contract offer so we can lock the dates.`
      ];
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      
      onSendMessage({
        senderId: selectedTalent.id,
        senderName: selectedTalent.name,
        receiverId: 'client_01',
        text: randomResponse,
        isClient: false
      });
    }, 1200);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[650px]">
        {/* Left Column: Conversations List */}
        <div className="w-full md:w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Direct Messages</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Live
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {talents.map((t) => (
              <div 
                key={t.id} 
                className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                  selectedTalent?.id === t.id ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : 'hover:bg-slate-800/40'
                }`}
                onClick={() => setSelectedTalent(t)}
              >
                <div className="relative shrink-0">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{t.name}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{t.headline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/60">
          {/* Chat Top Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3 min-w-0">
              <img src={selectedTalent?.avatar} alt={selectedTalent?.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white truncate">{selectedTalent?.name}</h4>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={11} /> {selectedTalent?.city} &bull; PKR {selectedTalent?.hourlyRate?.toLocaleString()}/hr
                </div>
              </div>
            </div>

            <button 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
              onClick={() => onHireTalent(selectedTalent)}
            >
              <Sparkles size={13} />
              <span>Send Offer</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isClient ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] p-3.5 rounded-2xl space-y-1 ${
                  msg.isClient 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs shadow-md' 
                    : 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700/60'
                }`}>
                  <div className="text-[10px] font-semibold text-white/70">{msg.senderName}</div>
                  <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-white/60">
                    <span>{msg.time}</span>
                    {msg.isClient && <CheckCheck size={12} className="text-white/80" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Pills */}
          <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickReplies.map((qr, i) => (
              <button 
                key={i} 
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap cursor-pointer transition-colors shrink-0"
                onClick={() => setInputText(qr)}
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
            <input 
              type="text"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              placeholder={`Message ${selectedTalent?.name || 'freelancer'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" 
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
