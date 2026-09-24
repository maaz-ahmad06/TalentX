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
    <div className={`talentx-preloader-overlay ${isFadingOut ? 'preloader-fade-out' : ''}`}>
      {/* Background Animated Glowing Ambient Orbs */}
      <div className="preloader-bg-orb orb-1"></div>
      <div className="preloader-bg-orb orb-2"></div>
      <div className="preloader-bg-orb orb-3"></div>

      <div className="preloader-content-box">
        {/* Animated 3D Emblem with Orbiting Rings */}
        <div className="preloader-emblem-wrap">
          {/* Outer Orbit Ring */}
          <div className="preloader-orbit-ring ring-1"></div>
          <div className="preloader-orbit-ring ring-2"></div>
          
          {/* Glowing Center Logo */}
          <div className="preloader-center-logo">
            <span className="preloader-logo-x">X</span>
            <div className="preloader-logo-glow"></div>
          </div>

          <Sparkles className="preloader-sparkle-dot sparkle-top" size={16} />
          <Sparkles className="preloader-sparkle-dot sparkle-bottom" size={14} />
        </div>

        {/* Brand Text */}
        <div className="preloader-brand-title">
          <h1>Talent<span className="text-gradient">X</span></h1>
          <span className="preloader-country-tag">🇵🇰 PAKISTAN LOCAL TALENT NETWORK</span>
        </div>

        {/* Progress Bar */}
        <div className="preloader-progress-track">
          <div 
            className="preloader-progress-bar"
            style={{ width: `${progress}%` }}
          >
            <div className="progress-shimmer-light"></div>
          </div>
        </div>

        {/* Status Text & Percentage */}
        <div className="preloader-status-row">
          <div className="preloader-status-msg">
            <span className="status-live-dot"></span>
            <span>{statusMessages[statusIndex]}</span>
          </div>
          <div className="preloader-percent-number">{progress}%</div>
        </div>
      </div>
    </div>
  );
};
