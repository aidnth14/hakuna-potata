import React, { useEffect, useState, useRef } from 'react';

interface HakunaLoaderProps {
  onComplete?: () => void;
}

export const HakunaLoader: React.FC<HakunaLoaderProps> = ({ onComplete }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const wavePathRef = useRef<SVGPathElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Fast, punchy splash duration (800ms)
  const duration = 800;

  const triggerExit = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    try {
      sessionStorage.setItem('hakuna_visited', 'true');
    } catch {}

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIsZooming(true);
    setTimeout(() => {
      setIsDone(true);
      if (onCompleteRef.current) onCompleteRef.current();
    }, 350);
  };

  useEffect(() => {
    // If already visited this session, skip loader instantly
    try {
      if (sessionStorage.getItem('hakuna_visited')) {
        setIsDone(true);
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }
    } catch {}

    if (hasFinishedRef.current) return;
    let phase = 0;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (hasFinishedRef.current) return;

      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      const rawProgress = Math.min(elapsed / duration, 1);
      // Smooth cubic bezier easing
      const eased =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentProgress = Math.round(eased * 100);
      phase += 0.07;

      // Update wave path in SVG clip-path
      if (wavePathRef.current) {
        const width = 1000;
        const height = 220;
        const targetY = height - (currentProgress / 100) * (height + 30) + 15;
        const amplitude = currentProgress >= 100 ? 0 : 10;
        const frequency = 0.016;

        let d = `M 0 ${height} L 0 ${targetY + Math.sin(phase) * amplitude}`;
        const step = 20;
        for (let x = step; x <= width; x += step) {
          const y = targetY + Math.sin(x * frequency + phase) * amplitude;
          d += ` L ${x} ${y}`;
        }
        d += ` L ${width} ${height} Z`;

        wavePathRef.current.setAttribute('d', d);
      }

      if (rawProgress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Reached 100%, zoom through
        setTimeout(triggerExit, 80);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Guaranteed failsafe timer
    const safetyTimer = setTimeout(() => {
      triggerExit();
    }, duration + 300);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      onClick={triggerExit}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0e12] select-none transition-all duration-700 ease-in-out px-4 cursor-pointer ${
        isZooming ? 'opacity-0 scale-[4] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        transformOrigin: '50% 50%',
        WebkitTapHighlightColor: 'transparent',
      }}
      title="Tap to skip"
    >
      {/* Scaled down, mobile-focused container */}
      <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-lg flex flex-col items-center">
        
        {/* SVG with Text and Wave ClipPath */}
        <div className="w-full">
          <svg
            viewBox="0 0 1000 200"
            className="w-full h-auto drop-shadow-2xl overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="hakuna-wave-clip">
                <path ref={wavePathRef} d="M 0 200 L 1000 200 Z" />
              </clipPath>
            </defs>

            {/* Base Text Layer (Dark Muted Gray) */}
            <text
              x="500"
              y="148"
              textAnchor="middle"
              className="font-black font-display tracking-tight"
              fill="#272930"
              style={{
                fontSize: '142px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
              }}
            >
              HAKUNA
            </text>

            {/* Filled Text Layer (Pure White, Clipped by Wave) */}
            <text
              x="500"
              y="148"
              textAnchor="middle"
              className="font-black font-display tracking-tight"
              fill="#ffffff"
              clipPath="url(#hakuna-wave-clip)"
              style={{
                fontSize: '142px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
              }}
            >
              HAKUNA
            </text>
          </svg>
        </div>

      </div>
    </div>
  );
};
