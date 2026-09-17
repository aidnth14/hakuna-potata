import React from 'react';

export const WatermarkPill: React.FC = () => {
  return (
    <aside
      aria-label="Creator credit"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 select-none print:hidden"
    >
      <a
        href="https://nonamedevs.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        title="Website crafted by @nonamedevs"
        className="group flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-all duration-300 text-[11px] sm:text-xs font-mono tracking-tight"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform duration-300 animate-pulse" />
        <span className="text-white/60 font-sans text-[10px] sm:text-[11px] uppercase tracking-wider">made by</span>
        <span className="font-semibold text-white/95 group-hover:text-amber-300 transition-colors duration-200">
          @nonamedevs
        </span>
      </a>
    </aside>
  );
};

export default WatermarkPill;
