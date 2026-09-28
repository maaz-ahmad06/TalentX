import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
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
  Search,
  UserPlus,
  X,
  ChevronRight,
  Plus
} from 'lucide-react';

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

export const MessagesPage = ({ 
  messages = [], 
  onSendMessage, 
  onMarkMessagesRead,
  talents = [], 
  contracts = [],
  proposals = [],
  jobs = [],
  currentUser = null,
  onLogout,
  onHireTalent 
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentUserId = String(currentUser?._id || currentUser?.id || '');
  const currentUserEmail = (currentUser?.email || '').trim().toLowerCase();

  // Multi-ID set for logged in user
  const myIds = React.useMemo(() => {
    if (!currentUser) return new Set();
    return new Set([
      currentUser._id,
      currentUser.id,
      currentUser.userId,
      currentUser.email,
      currentUser.name
    ].filter(Boolean).map(s => String(s).trim().toLowerCase()));
  }, [currentUser]);

  const unreadTotalCount = React.useMemo(() => {
    if (!currentUser || !Array.isArray(messages)) return 0;
    return messages.filter(m => {
      if (!m || m.isRead) return false;
      const sId = String(m.senderId || '').trim().toLowerCase();
      const rId = String(m.receiverId || '').trim().toLowerCase();
      const sEmail = (m.senderEmail || '').trim().toLowerCase();
      const rEmail = (m.receiverEmail || '').trim().toLowerCase();
      const sName = (m.senderName || '').trim().toLowerCase();

      const isSenderMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));
      const isReceiverMe = myIds.has(rId) || (rEmail && myIds.has(rEmail));

      return isReceiverMe && !isSenderMe && !m.isRead;
    }).length;
  }, [messages, currentUser, myIds]);

  // Helper to determine if a contact/user object is the logged-in user themselves
  const isSelf = (userObj) => {
    if (!userObj || !currentUser) return false;
    const uid = String(userObj._id || userObj.id || userObj.userId || '').trim().toLowerCase();
    const uEmail = (userObj.email || '').trim().toLowerCase();

    if (uid && myIds.has(uid)) return true;
    if (uEmail && myIds.has(uEmail)) return true;
    return false;
  };

  const incomingTarget = location.state?.targetUser || null;
  const incomingUserId = searchParams.get('userId');

  // Modal for starting a new chat with any member on the platform
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const [inputText, setInputText] = useState('');

  const chatFeedRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const isUserNearBottomRef = useRef(true);
  const lastContactIdRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // 1. Build dynamic contacts list:
  const contacts = React.useMemo(() => {
    const list = [];
    const addedIds = new Set();

    const addContact = (item, extra = {}) => {
      if (!item) return;
      const cId = String(item._id || item.id || item.userId || '');
      if (!cId || isSelf(item) || addedIds.has(cId)) return;
      addedIds.add(cId);

      list.push({
        id: cId,
        _id: cId,
        userId: item.userId || cId,
        name: item.name || 'TalentX Member',
        avatar: item.avatar || FALLBACK_AVATAR,
        headline: item.headline || (item.role === 'client' ? 'Client Employer' : 'Freelance Specialist'),
        city: item.city || 'Pakistan',
        hourlyRate: item.hourlyRate,
        role: item.role || 'talent',
        ...extra
      });
    };

    // (A) Target user from navigation state
    if (incomingTarget && !isSelf(incomingTarget)) {
      addContact(incomingTarget);
    }

    // (B) Target user from URL query param
    if (incomingUserId && incomingUserId !== currentUserId) {
      const foundTalent = talents.find(t => String(t._id || t.id) === incomingUserId);
      if (foundTalent && !isSelf(foundTalent)) {
        addContact(foundTalent);
      }
    }

    // (C) Real Message History (Anyone who has sent or received messages with currentUser)
    const threadMap = new Map();
    (Array.isArray(messages) ? messages : []).forEach(m => {
      if (!m) return;
      const sId = String(m.senderId || '').trim().toLowerCase();
      const rId = String(m.receiverId || '').trim().toLowerCase();
      const sEmail = (m.senderEmail || '').trim().toLowerCase();
      const rEmail = (m.receiverEmail || '').trim().toLowerCase();
      const sName = (m.senderName || '').trim().toLowerCase();

      const isSenderMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));
      const isReceiverMe = myIds.has(rId) || (rEmail && myIds.has(rEmail));

      // Only include messages involving currentUser
      if (currentUser && !isSenderMe && !isReceiverMe) return;

      const otherId = isSenderMe ? String(m.receiverId || '') : String(m.senderId || '');
      const otherName = isSenderMe ? (m.receiverName || 'Member') : (m.senderName || 'Member');
      const otherAvatar = isSenderMe ? (m.receiverAvatar || FALLBACK_AVATAR) : (m.senderAvatar || FALLBACK_AVATAR);
      const isOtherClient = isSenderMe ? !m.isClient : m.isClient;

      if (!otherId || myIds.has(otherId.toLowerCase())) return;

      if (!threadMap.has(otherId)) {
        threadMap.set(otherId, {
          id: otherId,
          name: otherName,
          avatar: otherAvatar,
          role: isOtherClient ? 'client' : 'talent',
          lastMsg: m
        });
      } else {
        threadMap.get(otherId).lastMsg = m;
      }
    });

    // Add conversation history counterparts
    threadMap.forEach((entry) => {
      const fullTalent = (Array.isArray(talents) ? talents : []).find(t => 
        String(t?._id || t?.id) === entry.id || 
        (t?.name && entry?.name && String(t.name).trim().toLowerCase() === String(entry.name).trim().toLowerCase())
      );
      addContact({
        id: entry.id,
        _id: fullTalent?._id || entry.id,
        name: fullTalent?.name || entry.name || 'TalentX Member',
        avatar: fullTalent?.avatar || entry.avatar || FALLBACK_AVATAR,
        headline: fullTalent?.headline || (entry.role === 'client' ? 'Client Employer' : 'Freelance Specialist'),
        city: fullTalent?.city || 'Pakistan',
        hourlyRate: fullTalent?.hourlyRate,
        role: fullTalent?.role || entry.role,
      });
    });

    // (D) Connected marketplace parties (Proposals & Contracts)
    if (currentUser) {
      if (currentUser.role === 'client') {
        (Array.isArray(proposals) ? proposals : []).forEach(p => {
          const tId = String(p.talentId || '');
          const matchingJob = (Array.isArray(jobs) ? jobs : []).find(j => String(j._id || j.id) === String(p.jobId));
          const isMyJob = matchingJob && String(matchingJob.clientId) === currentUserId;
          if (isMyJob || String(p.clientId) === currentUserId) {
            const tObj = (Array.isArray(talents) ? talents : []).find(t => String(t._id || t.id) === tId);
            addContact({
              id: tId,
              _id: tId,
              name: p.talentName || tObj?.name || 'Applicant Freelancer',
              avatar: p.talentAvatar || tObj?.avatar,
              headline: tObj?.headline || `Applicant: ${p.jobTitle || 'Job'}`,
              city: tObj?.city || 'Pakistan',
              role: 'talent'
            });
          }
        });

        (Array.isArray(contracts) ? contracts : []).forEach(c => {
          if (String(c.clientId) === currentUserId) {
            const tId = String(c.talentId || '');
            const tObj = (Array.isArray(talents) ? talents : []).find(t => String(t._id || t.id) === tId);
            addContact({
              id: tId,
              _id: tId,
              name: c.talentName || tObj?.name || 'Contracted Talent',
              avatar: c.talentAvatar || tObj?.avatar,
              headline: tObj?.headline || `Active Contract: ${c.jobTitle}`,
              city: tObj?.city || 'Pakistan',
              role: 'talent'
            });
          }
        });
      } else if (currentUser.role === 'talent') {
        (Array.isArray(proposals) ? proposals : []).forEach(p => {
          if (String(p.talentId) === currentUserId) {
            const matchingJob = (Array.isArray(jobs) ? jobs : []).find(j => String(j._id || j.id) === String(p.jobId));
            if (matchingJob) {
              const cId = String(matchingJob.clientId || matchingJob.client?.id || matchingJob.client?._id || '');
              if (cId) {
                addContact({
                  id: cId,
                  _id: cId,
                  name: matchingJob.client?.name || matchingJob.clientName || 'Client Employer',
                  avatar: matchingJob.client?.avatar || matchingJob.clientAvatar || FALLBACK_AVATAR,
                  headline: `Job Poster: ${matchingJob.title}`,
                  city: matchingJob.client?.city || 'Pakistan',
                  role: 'client'
                });
              }
            }
          }
        });

        (Array.isArray(contracts) ? contracts : []).forEach(c => {
          if (String(c.talentId) === currentUserId) {
            const cId = String(c.clientId || '');
            addContact({
              id: cId,
              _id: cId,
              name: c.clientName || 'Client Employer',
              avatar: c.clientAvatar || FALLBACK_AVATAR,
              headline: `Contract: ${c.jobTitle}`,
              city: 'Pakistan',
              role: 'client'
            });
          }
        });
      }
    }

    return list;
  }, [talents, messages, currentUser, myIds, currentUserId, contracts, proposals, jobs, incomingTarget, incomingUserId]);

  const [selectedContactId, setSelectedContactId] = useState(() => {
    if (incomingTarget && !isSelf(incomingTarget)) {
      return String(incomingTarget._id || incomingTarget.id || incomingTarget.userId || '');
    }
    if (incomingUserId && incomingUserId !== currentUserId) {
      return incomingUserId;
    }
    try {
      return localStorage.getItem('talentx_active_chat_contact_id') || null;
    } catch {
      return null;
    }
  });

  // Keep selected contact synced when navigating with explicit target
  useEffect(() => {
    if (incomingTarget && !isSelf(incomingTarget)) {
      const targetId = String(incomingTarget._id || incomingTarget.id || incomingTarget.userId || '');
      setSelectedContactId(targetId);
      try { localStorage.setItem('talentx_active_chat_contact_id', targetId); } catch {}
      return;
    }
    if (incomingUserId && incomingUserId !== currentUserId) {
      setSelectedContactId(incomingUserId);
      try { localStorage.setItem('talentx_active_chat_contact_id', incomingUserId); } catch {}
    }
  }, [incomingTarget, incomingUserId, currentUserId]);

  const selectContact = React.useCallback((contact) => {
    if (!contact) {
      setSelectedContactId(null);
      try { localStorage.removeItem('talentx_active_chat_contact_id'); } catch {}
      return;
    }
    const cId = String(contact._id || contact.id || contact.userId || '');
    setSelectedContactId(cId);
    try { localStorage.setItem('talentx_active_chat_contact_id', cId); } catch {}
    if (onMarkMessagesRead) {
      onMarkMessagesRead(contact);
    }
  }, [onMarkMessagesRead]);

  // Derive active selectedContact object dynamically from contacts, talents or incomingTarget
  const selectedContact = React.useMemo(() => {
    if (!selectedContactId) return null;
    const targetIdStr = String(selectedContactId).trim().toLowerCase();

    // 1. Look in dynamic contacts computed from history
    const foundInContacts = contacts.find(c => {
      if (!c) return false;
      const cId = String(c._id || c.id || c.userId || '').trim().toLowerCase();
      const cName = String(c.name || '').trim().toLowerCase();
      return cId === targetIdStr || cName === targetIdStr;
    });
    if (foundInContacts) return foundInContacts;

    // 2. Look in full talents directory
    const foundInTalents = (Array.isArray(talents) ? talents : []).find(t => {
      if (!t) return false;
      const tId = String(t._id || t.id || '').trim().toLowerCase();
      const tName = String(t.name || '').trim().toLowerCase();
      return tId === targetIdStr || tName === targetIdStr;
    });
    if (foundInTalents && !isSelf(foundInTalents)) {
      return {
        id: String(foundInTalents._id || foundInTalents.id),
        _id: String(foundInTalents._id || foundInTalents.id),
        userId: String(foundInTalents._id || foundInTalents.id),
        name: foundInTalents.name || 'TalentX Member',
        avatar: foundInTalents.avatar || FALLBACK_AVATAR,
        headline: foundInTalents.headline || 'Freelance Specialist',
        city: foundInTalents.city || 'Pakistan',
        hourlyRate: foundInTalents.hourlyRate,
        role: foundInTalents.role || 'talent'
      };
    }

    // 3. Fallback to incomingTarget
    if (incomingTarget && !isSelf(incomingTarget)) {
      return incomingTarget;
    }

    return null;
  }, [selectedContactId, contacts, talents, isSelf, incomingTarget]);

  // Multi-ID set for the currently selected contact
  const selectedContactIds = React.useMemo(() => {
    if (!selectedContact && !selectedContactId) return new Set();
    const ids = [
      selectedContactId,
      selectedContact?._id,
      selectedContact?.id,
      selectedContact?.userId,
      selectedContact?.email,
      selectedContact?.name
    ].filter(Boolean).map(s => String(s).trim().toLowerCase());
    return new Set(ids);
  }, [selectedContact, selectedContactId]);

  // 1-on-1 Messages between currentUser and selectedContact
  const activeThreadMessages = React.useMemo(() => {
    if (!selectedContactId || selectedContactIds.size === 0) return [];
    
    const thread = (Array.isArray(messages) ? messages : []).filter(m => {
      if (!m || !m.text) return false;
      const sId = String(m.senderId || '').trim().toLowerCase();
      const rId = String(m.receiverId || '').trim().toLowerCase();
      const sEmail = String(m.senderEmail || '').trim().toLowerCase();
      const rEmail = String(m.receiverEmail || '').trim().toLowerCase();
      const sName = String(m.senderName || '').trim().toLowerCase();
      const rName = String(m.receiverName || '').trim().toLowerCase();

      const isSenderMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));
      const isReceiverMe = myIds.has(rId) || (rEmail && myIds.has(rEmail)) || (rName && myIds.has(rName));

      const isSenderContact = selectedContactIds.has(sId) || (sEmail && selectedContactIds.has(sEmail)) || (sName && selectedContactIds.has(sName));
      const isReceiverContact = selectedContactIds.has(rId) || (rEmail && selectedContactIds.has(rEmail)) || (rName && selectedContactIds.has(rName));

      return (isSenderMe && isReceiverContact) || (isSenderContact && isReceiverMe);
    });

    // Deduplicate messages
    const seen = new Set();
    const deduplicated = [];
    thread.forEach(m => {
      if (!m) return;
      const key = m._id ? String(m._id) : (m.id ? String(m.id) : `${m.senderId}_${m.receiverId}_${m.text}_${m.time || ''}`);
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(m);
      }
    });

    return deduplicated;
  }, [messages, myIds, selectedContactId, selectedContactIds]);

  // Mark unread messages as read only when unread messages from contact exist
  useEffect(() => {
    if (!selectedContact || !onMarkMessagesRead) return;

    const hasUnreadFromContact = activeThreadMessages.some(m => {
      if (!m || m.isRead) return false;
      const sId = String(m.senderId || '').trim().toLowerCase();
      const sEmail = String(m.senderEmail || '').trim().toLowerCase();
      const sName = String(m.senderName || '').trim().toLowerCase();
      const isSenderMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));
      return !isSenderMe && !m.isRead;
    });

    if (hasUnreadFromContact) {
      onMarkMessagesRead(selectedContact);
    }
  }, [selectedContact, activeThreadMessages, onMarkMessagesRead, myIds]);

  // User scroll listener to detect if reading history
  const handleFeedScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isUserNearBottomRef.current = isNearBottom;
  };

  // Smart scroll effect: Only auto-scroll on initial load or if user is at the bottom
  useEffect(() => {
    if (!selectedContactId) return;
    const currentContactKey = String(selectedContactId || '');
    const isContactSwitch = lastContactIdRef.current !== currentContactKey;
    const currentMsgCount = activeThreadMessages.length;
    const isNewMessageAdded = currentMsgCount > lastMessageCountRef.current;

    lastContactIdRef.current = currentContactKey;
    lastMessageCountRef.current = currentMsgCount;

    if (isContactSwitch) {
      isUserNearBottomRef.current = true;
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 50);
    } else if (isNewMessageAdded && isUserNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThreadMessages, selectedContactId]);

  // Send real manual message — NO fake auto-replies!
  const handleSend = () => {
    const trimmed = (inputText || '').trim();
    if (!trimmed || !selectedContactId) return;

    const primaryContactId = String(selectedContact?._id || selectedContact?.id || selectedContact?.userId || selectedContactId || '');
    const primaryMyId = String(currentUser?._id || currentUser?.id || currentUser?.userId || 'guest');

    if (onSendMessage) {
      onSendMessage({
        senderId: primaryMyId,
        senderName: currentUser?.name || 'User',
        senderAvatar: currentUser?.avatar || '',
        receiverId: primaryContactId,
        receiverName: selectedContact?.name || 'Member',
        receiverAvatar: selectedContact?.avatar || '',
        text: trimmed,
        isClient: currentUser?.role === 'client'
      });
    }

    setInputText('');
    isUserNearBottomRef.current = true;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      chatInputRef.current?.focus();
    }, 50);
  };

  const filteredContacts = React.useMemo(() => {
    const q = (threadSearch || '').trim().toLowerCase();
    return (Array.isArray(contacts) ? contacts : []).filter(c => {
      if (!c) return false;
      const name = String(c.name || '').toLowerCase();
      const city = String(c.city || '').toLowerCase();
      return name.includes(q) || city.includes(q);
    });
  }, [contacts, threadSearch]);

  // Filter available members for "Start New Chat" modal (excluding self)
  const availableNewMembers = React.useMemo(() => {
    const q = (newChatSearch || '').trim().toLowerCase();
    return (Array.isArray(talents) ? talents : []).filter(t => {
      if (!t || isSelf(t)) return false;
      if (!q) return true;
      const name = String(t.name || '').toLowerCase();
      const headline = String(t.headline || '').toLowerCase();
      const city = String(t.city || '').toLowerCase();
      const skillsMatch = Array.isArray(t.skills) && t.skills.some(s => String(s || '').toLowerCase().includes(q));
      return name.includes(q) || headline.includes(q) || city.includes(q) || skillsMatch;
    });
  }, [talents, isSelf, newChatSearch]);

  // Helper to render the core chat workspace directly without nested component recreation
  const renderChatWorkspace = () => (
    <div className="flex h-full w-full rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden backdrop-blur-2xl shadow-2xl">
      {/* Left Column: Conversations List */}
      <div className="w-80 bg-slate-950/60 border-r border-white/10 flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm">Direct Conversations</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
              Live
            </span>
          </div>
          <button 
            type="button"
            onClick={() => {
              setNewChatSearch('');
              setIsNewChatModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
            title="Start New Chat"
          >
            <UserPlus size={13} />
            <span>New Chat</span>
          </button>
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
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <MessageSquare size={18} />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                No active conversations yet. Click <strong className="text-indigo-400">New Chat</strong> to message any verified professional.
              </p>
              <button 
                type="button"
                onClick={() => setIsNewChatModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <UserPlus size={13} />
                <span>Start a Chat</span>
              </button>
            </div>
          ) : (
            filteredContacts.map((c) => {
              const cId = String(c._id || c.id || '');
              const contactCandidateIds = new Set([c._id, c.id, c.userId, c.email, c.name].filter(Boolean).map(s => String(s).trim().toLowerCase()));

              const threadMsgs = (Array.isArray(messages) ? messages : []).filter(m => {
                if (!m) return false;
                const sId = String(m.senderId || '').trim().toLowerCase();
                const rId = String(m.receiverId || '').trim().toLowerCase();
                const sEmail = (m.senderEmail || '').trim().toLowerCase();
                const rEmail = (m.receiverEmail || '').trim().toLowerCase();
                const sName = (m.senderName || '').trim().toLowerCase();
                const rName = (m.receiverName || '').trim().toLowerCase();

                const isSenderMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));
                const isReceiverMe = myIds.has(rId) || (rEmail && myIds.has(rEmail)) || (rName && myIds.has(rName));

                const isContactSender = contactCandidateIds.has(sId) || (sEmail && contactCandidateIds.has(sEmail)) || (sName && contactCandidateIds.has(sName));
                const isContactReceiver = contactCandidateIds.has(rId) || (rEmail && contactCandidateIds.has(rEmail)) || (rName && contactCandidateIds.has(rName));

                return (isSenderMe && isContactReceiver) || (isContactSender && isReceiverMe);
              });

              const lastMsg = threadMsgs[threadMsgs.length - 1];
              const unreadCount = threadMsgs.filter(m => {
                if (!m || m.isRead) return false;
                const sId = String(m.senderId || '').trim().toLowerCase();
                const rId = String(m.receiverId || '').trim().toLowerCase();
                const sEmail = (m.senderEmail || '').trim().toLowerCase();
                const rEmail = (m.receiverEmail || '').trim().toLowerCase();
                const sName = (m.senderName || '').trim().toLowerCase();

                const isSenderMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));
                const isReceiverMe = myIds.has(rId) || (rEmail && myIds.has(rEmail));

                return isReceiverMe && !isSenderMe && !m.isRead;
              }).length;

              const isSelected = selectedContact && (
                String(selectedContact._id || selectedContact.id || selectedContact.userId || '') === cId ||
                (selectedContact.name && c.name && String(selectedContact.name).trim().toLowerCase() === String(c.name).trim().toLowerCase())
              );

              return (
                <div 
                  key={cId} 
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-600/20 border border-indigo-500/40 shadow-md' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  onClick={() => selectContact(c)}
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <img src={c.avatar || FALLBACK_AVATAR} alt={c.name || 'User'} className="w-full h-full rounded-full object-cover border border-white/10" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-bold text-xs truncate ${isSelected ? 'text-indigo-300' : 'text-white'}`}>{c.name || 'Member'}</span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-500 shrink-0">{lastMsg.time || ''}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-[11px] text-slate-400 truncate">
                        {lastMsg ? lastMsg.text : (c.headline || 'Direct Conversation')}
                      </p>
                      {unreadCount > 0 && (
                        <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-md shadow-indigo-500/30">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/80 min-w-0">
        {selectedContact ? (
          <>
            {/* Top Header */}
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedContact.avatar || FALLBACK_AVATAR} 
                  alt={selectedContact.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-md" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{selectedContact.name || 'TalentX Member'}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                      <ShieldCheck size={11} /> {selectedContact.role === 'client' ? 'Client' : 'Verified Pro'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={11} /> {selectedContact.city || 'Pakistan'} {Number.isFinite(Number(selectedContact.hourlyRate)) && Number(selectedContact.hourlyRate) > 0 ? `• PKR ${Number(selectedContact.hourlyRate).toLocaleString()}/hr` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onHireTalent && selectedContact.role !== 'client' && (
                  <button 
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                    onClick={() => onHireTalent(selectedContact)}
                  >
                    <Sparkles size={13} />
                    <span>Send Hire Offer</span>
                  </button>
                )}
                {selectedContact.role !== 'client' && (selectedContact._id || selectedContact.id) && (
                  <Link 
                    to={`/profile/${selectedContact._id || selectedContact.id}`} 
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-all"
                  >
                    <span>View Portfolio</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Messages Feed */}
            <div 
              ref={chatFeedRef}
              onScroll={handleFeedScroll}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {activeThreadMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                    <MessageSquare size={24} />
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">Start the Conversation</h4>
                  <p className="text-slate-400 text-xs max-w-xs">
                    Send a direct message to {selectedContact.name || 'Member'} regarding your project or inquiry.
                  </p>
                </div>
              ) : (
                activeThreadMessages.map((msg, index) => {
                  if (!msg) return null;
                  const sId = String(msg.senderId || '').trim().toLowerCase();
                  const sEmail = (msg.senderEmail || '').trim().toLowerCase();
                  const sName = (msg.senderName || '').trim().toLowerCase();

                  const isSentByMe = myIds.has(sId) || (sEmail && myIds.has(sEmail)) || (sName && myIds.has(sName));

                  return (
                    <div 
                      key={msg._id || msg.id || `msg_${index}`} 
                      className={`flex w-full ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[75%] sm:max-w-[65%] shadow-lg ${
                        isSentByMe 
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-br-none shadow-indigo-500/20' 
                          : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none'
                      }`}>
                        <div className="text-[10px] font-bold opacity-80 mb-1 flex items-center justify-between gap-3">
                          <span>{isSentByMe ? 'You' : (msg.senderName || selectedContact?.name || 'Contact')}</span>
                        </div>
                        <p className="m-0 text-xs sm:text-sm whitespace-pre-wrap">{msg.text || ''}</p>
                        <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 mt-1.5">
                          <span>{msg.time || 'Just now'}</span>
                          {isSentByMe && (
                            <CheckCheck size={12} className={msg.isRead ? 'text-emerald-300' : 'text-cyan-200'} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar — Pure div container, zero form submissions */}
            <div className="p-4 px-6 bg-slate-900 border-t border-white/10 flex items-center gap-3 flex-shrink-0">
              <input 
                ref={chatInputRef}
                type="text"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm outline-none transition-all"
                placeholder={`Message ${selectedContact?.name || 'member'}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();
                    handleSend();
                  }
                }}
                autoComplete="off"
              />
              <button 
                type="button" 
                onClick={(e) => {
                  if (e.preventDefault) e.preventDefault();
                  if (e.stopPropagation) e.stopPropagation();
                  handleSend();
                }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex-shrink-0"
                title="Send Message"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Empty state when no conversation is selected (WhatsApp / LinkedIn style) */
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-500/10">
              <MessageSquare size={32} />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-black text-white font-display">Select a Conversation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Choose a conversation from the left sidebar to view messages, or start a new direct chat with verified clients and freelancers.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsNewChatModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <UserPlus size={15} />
                <span>Start New Chat</span>
              </button>
              <Link 
                to="/talents"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs transition-all"
              >
                <span>Browse Talents</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Start New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Start Direct Conversation</h3>
                  <p className="text-slate-400 text-[11px]">Select a verified professional to message</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-white/5 bg-slate-950/30">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
                <input 
                  type="text" 
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  placeholder="Search by name, skill, or city..."
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Users List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {availableNewMembers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                  <p>No professionals matching "{newChatSearch}" found.</p>
                </div>
              ) : (
                availableNewMembers.map((member) => {
                  const mId = String(member._id || member.id);
                  return (
                    <div 
                      key={mId}
                      onClick={() => {
                        selectContact({
                          id: mId,
                          _id: mId,
                          name: member.name || 'TalentX Member',
                          avatar: member.avatar || FALLBACK_AVATAR,
                          headline: member.headline || 'Freelance Specialist',
                          city: member.city || 'Pakistan',
                          hourlyRate: member.hourlyRate,
                          role: member.role || 'talent'
                        });
                        setIsNewChatModalOpen(false);
                        setTimeout(() => chatInputRef.current?.focus(), 150);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={member.avatar || FALLBACK_AVATAR} 
                          alt={member.name} 
                          className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors truncate">
                              {member.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[9px] font-bold">
                              Verified
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {member.headline || member.category || 'Freelance Specialist'}
                          </p>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {member.city || 'Pakistan'} {member.hourlyRate ? `• PKR ${Number(member.hourlyRate).toLocaleString()}/hr` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
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
              <Link to="/messages" className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span>Messages & Chat</span>
                </div>
                {unreadTotalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-500/30 animate-pulse">
                    {unreadTotalCount}
                  </span>
                )}
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
            {renderChatWorkspace()}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for Public / Guest Mode
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-100px)]">
      {renderChatWorkspace()}
    </div>
  );
};
