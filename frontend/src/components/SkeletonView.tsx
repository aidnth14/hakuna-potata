import React from 'react';

export const SkeletonView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800 relative overflow-hidden pointer-events-none select-none animate-in fade-in duration-500">
      
      {/* Top Left: Skeleton Cookie Popup */}
      <div className="fixed top-3.5 left-3.5 right-3.5 sm:right-auto sm:w-[310px] z-40 p-4 rounded-2xl bg-slate-900 border border-neutral-800 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full animate-shimmer-dark" />
            <div className="w-16 h-3 rounded animate-shimmer-dark" />
          </div>
          <div className="w-3 h-3 rounded animate-shimmer-dark" />
        </div>
        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded animate-shimmer-dark" />
          <div className="w-3/4 h-2.5 rounded animate-shimmer-dark" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-7 rounded-xl animate-shimmer-dark" />
          <div className="flex-1 h-7 rounded-xl animate-shimmer-dark" />
        </div>
      </div>

      {/* Top Right: Skeleton Audio Capsule */}
      <div className="fixed top-3 right-3 sm:top-3.5 sm:right-3.5 z-40">
        <div className="h-6 w-24 sm:w-28 rounded-full bg-slate-900 border border-neutral-800 animate-shimmer-dark" />
      </div>

      {/* Main Body Skeleton - Twin Arch Gate Shape */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-0">
        {/* Mobile Tab Skeleton */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-neutral-100 rounded-full mb-5">
          <div className="w-16 h-6 rounded-full bg-slate-200 animate-shimmer" />
          <div className="w-24 h-6 rounded-full bg-slate-200 animate-shimmer" />
        </div>

        {/* Desktop Twin Skeleton (>= md) */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12 w-full max-w-5xl">
          <div className="w-full max-w-[320px] lg:max-w-[360px] flex flex-col items-center">
            <div className="w-full p-2 sm:p-2.5 rounded-t-full border-[1.5px] border-neutral-200 bg-white">
              <div className="w-full p-1 sm:p-1.5 rounded-t-full border border-neutral-100">
                <div className="w-full aspect-[4/5] rounded-t-full bg-slate-100 animate-shimmer" />
              </div>
            </div>
            <div className="mt-4 w-28 h-2.5 rounded bg-slate-200 animate-shimmer" />
          </div>
          <div className="w-full max-w-[320px] lg:max-w-[360px] flex flex-col items-center">
            <div className="w-full p-2 sm:p-2.5 rounded-t-full border-[1.5px] border-neutral-200 bg-white">
              <div className="w-full p-1 sm:p-1.5 rounded-t-full border border-neutral-100">
                <div className="w-full aspect-[4/5] rounded-t-full bg-slate-100 animate-shimmer" />
              </div>
            </div>
            <div className="mt-4 w-28 h-2.5 rounded bg-slate-200 animate-shimmer" />
          </div>
        </div>

        {/* Mobile Single Skeleton (< md) */}
        <div className="flex md:hidden w-full max-w-[280px] xs:max-w-[310px] sm:max-w-[340px] flex-col items-center">
          <div className="w-full p-2 rounded-t-full border-[1.5px] border-neutral-200 bg-white">
            <div className="w-full p-1 rounded-t-full border border-neutral-100">
              <div className="w-full aspect-[4/5] rounded-t-full bg-slate-100 animate-shimmer" />
            </div>
          </div>
          <div className="mt-3.5 w-28 h-2 rounded bg-slate-200 animate-shimmer" />
        </div>
      </main>

      {/* Footer Wrapper Skeleton */}
      <div className="relative w-full overflow-visible">
        {/* Bread Icon Skeletons */}
        <div className="absolute right-6 sm:right-16 md:right-24 -top-[48px] sm:-top-[58px] md:-top-[82px] z-0">
          <div className="relative w-32 sm:w-36 md:w-44 h-16 sm:h-20">
            <div className="w-full h-8 sm:h-10 rounded-full bg-slate-200 animate-shimmer rotate-[-22deg] opacity-70" />
            <div className="absolute top-2 left-6 w-full h-8 sm:h-10 rounded-full bg-slate-300 animate-shimmer rotate-[25deg] opacity-80" />
          </div>
        </div>

        {/* Skeleton Black Footer */}
        <footer className="w-full bg-black pt-7 sm:pt-8 pb-5 px-4 sm:px-12 rounded-t-[24px] sm:rounded-t-[36px] shadow-2xl relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col justify-between gap-6 sm:gap-8">
            
            {/* Main Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
              {/* Left Brand Skeleton */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 animate-shimmer-dark shrink-0" />
                <div className="w-36 sm:w-48 h-5 sm:h-7 rounded-lg bg-neutral-900 animate-shimmer-dark" />
              </div>

              {/* Right Contact Skeleton */}
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-4">
                <div className="w-[1px] h-8 sm:h-9 bg-neutral-800 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-16 h-2.5 rounded bg-neutral-900 animate-shimmer-dark" />
                  <div className="w-44 sm:w-56 h-2.5 rounded bg-neutral-900 animate-shimmer-dark" />
                  <div className="w-24 h-2.5 rounded bg-neutral-900 animate-shimmer-dark" />
                </div>
              </div>
            </div>

            {/* Bottom Centre Skeleton */}
            <div className="w-full pt-4 border-t border-neutral-900 flex items-center justify-center">
              <div className="w-36 h-2 rounded bg-neutral-900 animate-shimmer-dark" />
            </div>

          </div>
        </footer>
      </div>

    </div>
  );
};
