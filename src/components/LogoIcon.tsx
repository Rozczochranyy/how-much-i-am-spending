import React from 'react';

export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="7" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="30" y="15" width="40" height="10" rx="5" />
      <path d="M35 25 C 20 35, 15 55, 25 75 C 35 90, 65 90, 75 75 C 85 55, 80 35, 65 25" />
      <circle cx="50" cy="55" r="16" />
      <path d="M55 49 C 50 45, 43 47, 43 55 C 43 63, 50 65, 55 61" />
    </svg>
  );
}
