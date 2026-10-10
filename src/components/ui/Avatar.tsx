import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const colorPalette = [
  'from-indigo-600 to-indigo-800 text-white',
  'from-teal-600 to-emerald-800 text-white',
  'from-slate-700 to-slate-900 text-white',
  'from-amber-600 to-amber-800 text-white',
  'from-purple-600 to-indigo-900 text-white',
  'from-rose-600 to-rose-800 text-white',
];

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colorPalette.length;
    return colorPalette[idx];
  };

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-14 h-14 text-base font-bold',
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${getGradient(
        name
      )} flex items-center justify-center font-medium shadow-2xs select-none shrink-0 ${
        sizeClasses[size]
      } ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
