import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Code2, 
  Server, 
  Cpu, 
  Palette, 
  Star 
} from 'lucide-react';

export const VerificationBadge = ({ 
  type = 'id', // 'id', 'skill', 'top-rated', 'pro'
  badgeName = 'Verified Pro',
  score = null,
  size = 'sm', // 'xs', 'sm', 'md', 'lg'
  showLabel = true,
  className = ''
}) => {
  const isIdBadge = type === 'id' || badgeName?.toLowerCase().includes('id') || badgeName?.toLowerCase().includes('nadra');
  const isSkillBadge = type === 'skill' || badgeName?.toLowerCase().includes('certified') || badgeName?.toLowerCase().includes('specialist');
  const isTopRated = type === 'top-rated' || badgeName?.toLowerCase().includes('top');

  const getIcon = () => {
    const iconSize = size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 15 : 18;
    if (badgeName?.includes('React') || badgeName?.includes('Frontend')) return <Code2 size={iconSize} />;
    if (badgeName?.includes('Node') || badgeName?.includes('Backend')) return <Server size={iconSize} />;
    if (badgeName?.includes('Python') || badgeName?.includes('AI')) return <Cpu size={iconSize} />;
    if (badgeName?.includes('UX') || badgeName?.includes('Design')) return <Palette size={iconSize} />;
    if (isIdBadge) return <ShieldCheck size={iconSize} />;
    if (isTopRated) return <Star size={iconSize} />;
    return <CheckCircle2 size={iconSize} />;
  };

  const getStyle = () => {
    if (isIdBadge) {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25';
    }
    if (isSkillBadge) {
      return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25';
    }
    if (isTopRated) {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25';
    }
    return 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25';
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1 gap-2',
    lg: 'text-sm sm:text-base px-4 py-1.5 gap-2.5'
  };

  return (
    <span 
      className={`inline-flex items-center font-bold rounded-full border transition-all shadow-sm ${getStyle()} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
      title={score ? `${badgeName} (Assessment Score: ${score}%)` : badgeName}
    >
      <span className="shrink-0">{getIcon()}</span>
      {showLabel && (
        <span className="truncate">
          {badgeName}
          {score && <span className="opacity-80 font-mono ml-1">({score}%)</span>}
        </span>
      )}
    </span>
  );
};
