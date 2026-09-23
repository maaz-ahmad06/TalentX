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
    <section className="chat-section">
      <div className="container">
        <div className="chat-interface-layout glass-panel">
          {/* Left Column: Conversations List */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h3>Direct Messages</h3>
              <span className="badge badge-pro">Live</span>
            </div>

            <div className="chat-threads-list">
              {talents.map((t) => (
                <div 
                  key={t.id} 
                  className={`chat-thread-item ${selectedTalent?.id === t.id ? 'active' : ''}`}
                  onClick={() => setSelectedTalent(t)}
                >
                  <div className="thread-avatar-wrap">
                    <img src={t.avatar} alt={t.name} className="thread-avatar" />
                    <span className="online-indicator"></span>
                  </div>
                  <div className="thread-info">
                    <div className="thread-name-row">
                      <span className="thread-name">{t.name}</span>
                      <span className="thread-time">Active</span>
                    </div>
                    <p className="thread-snippet">{t.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Conversation */}
          <div className="chat-main-area">
            {/* Chat Top Header */}
            <div className="chat-header-bar">
              <div className="chat-target-profile">
                <img src={selectedTalent?.avatar} alt={selectedTalent?.name} className="target-avatar" />
                <div>
                  <div className="target-name-row">
                    <h4>{selectedTalent?.name}</h4>
                    <span className="badge badge-pro"><ShieldCheck size={12} /> Verified</span>
                  </div>
                  <div className="target-status-text">
                    <MapPin size={12} /> {selectedTalent?.city} &bull; PKR {selectedTalent?.hourlyRate?.toLocaleString()}/hr
                  </div>
                </div>
              </div>

              <div className="chat-header-actions">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onHireTalent(selectedTalent)}
                >
                  <Sparkles size={14} />
                  <span>Send Offer</span>
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="chat-messages-container">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`chat-bubble-row ${msg.isClient ? 'bubble-right' : 'bubble-left'}`}
                >
                  <div className="chat-bubble">
                    <div className="bubble-sender-name">{msg.senderName}</div>
                    <p className="bubble-text">{msg.text}</p>
                    <div className="bubble-meta">
                      <span>{msg.time}</span>
                      {msg.isClient && <CheckCheck size={13} className="check-double" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Reply Pills */}
            <div className="quick-replies-strip">
              {quickReplies.map((qr, i) => (
                <button 
                  key={i} 
                  className="quick-reply-pill"
                  onClick={() => setInputText(qr)}
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="chat-input-bar">
              <input 
                type="text"
                className="chat-text-input"
                placeholder={`Message ${selectedTalent?.name || 'freelancer'}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-icon">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
