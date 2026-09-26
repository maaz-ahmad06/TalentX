import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const finishedRef = useRef(false);

  const statusMessages = [
    'Initializing TalentX Ecosystem...',
    'Calibrating AI Neural Match Engine...',
    'Loading Verified Local Portfolios...',
    'Connecting Pakistani Businesses & Freelancers...',
    'Welcome to TalentX!'
  ];

  const handleComplete = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 500);
  };

  useEffect(() => {
    // Progress counter timer
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleComplete();
          return 100;
        }
        const increment = Math.floor(Math.random() * 20) + 15;
        const next = Math.min(100, prev + increment);
        if (next >= 100) {
          clearInterval(interval);
          handleComplete();
        }
        return next;
      });
    }, 150);

    // Absolute fallback: Auto-dismiss after 2.5s
    const fallbackTimer = setTimeout(() => {
      handleComplete();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Update status message
  useEffect(() => {
    if (progress < 25) setStatusIndex(0);
    else if (progress < 50) setStatusIndex(1);
    else if (progress < 75) setStatusIndex(2);
    else if (progress < 95) setStatusIndex(3);
    else setStatusIndex(4);
  }, [progress]);

  return (
    <div className={`fixed inset-0 z-[99999] bg-slate-950 flex items-center justify-center p-4 transition-opacity duration-500 overflow-hidden ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Background Animated Glowing Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
        {/* Animated 3D Emblem with Orbiting Rings */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/40 animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-purple-500/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
          
          {/* Glowing Center Logo */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-indigo-500/40">
            <span>X</span>
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-md -z-10"></div>
          </div>

          <Sparkles className="absolute -top-1 right-2 text-indigo-400 animate-bounce" size={16} />
          <Sparkles className="absolute -bottom-1 left-2 text-purple-400 animate-pulse" size={14} />
        </div>

        {/* Brand Text */}
        <div className="mb-6">
          <h1 className="font-display font-black text-3xl tracking-tight text-white mb-1">
            Talent<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">X</span>
          </h1>
          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
            🇵🇰 PAKISTAN LOCAL TALENT NETWORK
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-950 border border-white/10 h-2.5 rounded-full overflow-hidden mb-4 p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

        {/* Status Text & Percentage */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="line-clamp-1 text-left">{statusMessages[statusIndex]}</span>
          </div>
          <div className="font-bold font-mono text-indigo-300 text-sm">{progress}%</div>
        </div>
      </div>
    </div>
  );
};
