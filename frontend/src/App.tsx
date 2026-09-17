import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Mail } from 'lucide-react';
import { AudioPlayer } from './components/AudioPlayer';
import { HakunaLoader } from './components/HakunaLoader';
import { CustomOrderPage } from './components/CustomOrderPage';
import { WhatsAppButton } from './components/WhatsAppButton';
import { WatermarkPill } from './components/WatermarkPill';

interface CakeItem {
  id: number;
  name: string;
  src: string;
  isBestSeller?: boolean;
}

const CAKES: CakeItem[] = [
  { id: 1, name: 'Cake 01', src: '/cakes/cake-01.webp' },
  { id: 2, name: 'Cake 02', src: '/cakes/cake-02.webp' },
  { id: 3, name: 'Cake 03', src: '/cakes/cake-03.webp', isBestSeller: true },
  { id: 4, name: 'Cake 04', src: '/cakes/cake-04.webp' },
  { id: 5, name: 'Cake 05', src: '/cakes/cake-05.webp' },
  { id: 6, name: 'Cake 06', src: '/cakes/cake-06.webp' },
  { id: 7, name: 'Cake 07', src: '/cakes/cake-07.webp', isBestSeller: true },
  { id: 8, name: 'Cake 08', src: '/cakes/cake-08.webp' },
  { id: 9, name: 'Cake 09', src: '/cakes/cake-09.webp' },
  { id: 10, name: 'Cake 10', src: '/cakes/cake-10.webp' },
  { id: 11, name: 'Cake 11', src: '/cakes/cake-11.webp' },
  { id: 12, name: 'Cake 12', src: '/cakes/cake-12.webp', isBestSeller: true },
  { id: 13, name: 'Cake 13', src: '/cakes/cake-13.webp' },
  { id: 14, name: 'Cake 14', src: '/cakes/cake-14.webp' },
  { id: 15, name: 'Coming Soon', src: '/cakes/cake-coming-soon.webp' },
];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'order'>('home');
  const [showCookies, setShowCookies] = useState(true);
  const [managingCookies, setManagingCookies] = useState(false);
  const [activeArch, setActiveArch] = useState(0);
  const [selectedCakeIndex, setSelectedCakeIndex] = useState<number | null>(null);
  const selectedCake = selectedCakeIndex !== null ? CAKES[selectedCakeIndex] : null;

  const handlePrevCake = () => {
    setSelectedCakeIndex((prev) => (prev === null ? null : (prev - 1 + CAKES.length) % CAKES.length));
  };

  const handleNextCake = () => {
    setSelectedCakeIndex((prev) => (prev === null ? null : (prev + 1) % CAKES.length));
  };

  useEffect(() => {
    if (selectedCakeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedCakeIndex((prev) => (prev === null ? null : (prev - 1 + CAKES.length) % CAKES.length));
      } else if (e.key === 'ArrowRight') {
        setSelectedCakeIndex((prev) => (prev === null ? null : (prev + 1) % CAKES.length));
      } else if (e.key === 'Escape') {
        setSelectedCakeIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCakeIndex]);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/order' || path === '/order/' || path.startsWith('/order')) {
        setCurrentView('order');
      } else {
        setCurrentView('home');
      }
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (view: 'home' | 'order', scrollToId?: string) => {
    if (view === 'home') {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      setCurrentView('home');
      if (scrollToId) {
        setTimeout(() => {
          document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'order') {
      if (window.location.pathname !== '/order') {
        window.history.pushState(null, '', '/order');
      }
      setCurrentView('order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800 relative overflow-x-hidden">
      
      {/* Fullscreen Wave Loading Screen */}
      <HakunaLoader />

      {/* Dim Background Restaurant Ambience & Music Player */}
      <AudioPlayer />

      {/* Hovering WhatsApp Floating Quick Chat */}
      <WhatsAppButton />

      {/* Watermark Pill */}
      <WatermarkPill />

      {/* Main Website - Immediate and Stable */}
      <div className="min-h-screen flex flex-col justify-between transition-opacity duration-300">
        {/* Cookie Popup - Mobile friendly */}
        {showCookies && (
          <aside
            aria-label="Cookie consent banner"
            className="fixed top-3.5 left-3.5 right-3.5 sm:right-auto sm:max-w-[320px] z-40 bg-black text-white p-4 rounded-2xl border border-neutral-800 shadow-2xl select-none animate-in fade-in duration-500"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://img.icons8.com/?size=100&id=39295&format=png&color=000000"
                    alt="Cookie"
                    className="w-4 h-4 object-contain shrink-0"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Cookies</span>
                </div>
                <button
                  onClick={() => setShowCookies(false)}
                  className="text-neutral-500 hover:text-white text-xs cursor-pointer p-1"
                  title="Close"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                We use cookies to personalize your experience and analyze traffic.
              </p>

              {managingCookies ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
                  <label className="flex items-center justify-between text-[11px] text-neutral-300 py-1">
                    <span>Essential (Required)</span>
                    <input type="checkbox" checked disabled className="accent-neutral-400" />
                  </label>
                  <label className="flex items-center justify-between text-[11px] text-neutral-300 py-1 cursor-pointer">
                    <span>Analytics & Preferences</span>
                    <input type="checkbox" defaultChecked className="accent-white cursor-pointer" />
                  </label>
                  <button
                    onClick={() => {
                      setManagingCookies(false);
                      setShowCookies(false);
                    }}
                    className="mt-1 w-full bg-white text-black font-bold text-xs py-2 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Save preferences
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowCookies(false)}
                    className="flex-1 bg-white text-black font-bold text-xs py-2 px-3 rounded-xl hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer text-center"
                  >
                    Accept cookies
                  </button>
                  <button
                    onClick={() => setManagingCookies(true)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs py-2 px-3 rounded-xl border border-neutral-800 active:scale-95 transition-all cursor-pointer text-center"
                  >
                    Manage
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Navigation Bar */}
        <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100 select-none transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            {/* Left: Brand / Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="Hakuna Potata Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-base sm:text-xl font-bold tracking-tight text-neutral-900 font-display group-hover:text-neutral-600 transition-colors">
                HAKUNA POTATA
              </span>
            </a>

            {/* Center: Desktop Navigation Links (HOME > CONTACT > ORDER) */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase font-display">
              <button
                onClick={() => navigateTo('home')}
                className={`transition-all duration-200 cursor-pointer py-1 ${
                  currentView === 'home'
                    ? 'text-black border-b-2 border-black font-extrabold'
                    : 'text-neutral-400 hover:text-black'
                }`}
              >
                HOME
              </button>
              <button
                onClick={() => navigateTo('home', 'contact')}
                className="text-neutral-400 hover:text-black transition-all duration-200 py-1 cursor-pointer"
              >
                CONTACT
              </button>
              <button
                onClick={() => navigateTo('order')}
                className={`transition-all duration-200 cursor-pointer py-1 ${
                  currentView === 'order'
                    ? 'text-black border-b-2 border-black font-extrabold'
                    : 'text-neutral-400 hover:text-black'
                }`}
              >
                ORDER
              </button>
            </nav>

            {/* Right: Mobile Navigation Links (HOME > CONTACT > ORDER) + Spacer */}
            <div className="flex items-center gap-3">
              <nav className="flex md:hidden items-center gap-2.5 text-[11px] font-bold tracking-wider uppercase font-display">
                <button
                  onClick={() => navigateTo('home')}
                  className={`transition-colors cursor-pointer py-0.5 ${
                    currentView === 'home' ? 'text-black font-extrabold border-b border-black' : 'text-neutral-400 hover:text-black'
                  }`}
                >
                  HOME
                </button>
                <span className="text-neutral-300 select-none">·</span>
                <button
                  onClick={() => navigateTo('home', 'contact')}
                  className="text-neutral-400 hover:text-black transition-colors py-0.5 cursor-pointer"
                >
                  CONTACT
                </button>
                <span className="text-neutral-300 select-none">·</span>
                <button
                  onClick={() => navigateTo('order')}
                  className={`transition-colors cursor-pointer py-0.5 ${
                    currentView === 'order' ? 'text-black font-extrabold border-b border-black' : 'text-neutral-400 hover:text-black'
                  }`}
                >
                  ORDER
                </button>
              </nav>
              <div className="w-16 sm:w-32 shrink-0" />
            </div>
          </div>
        </header>

        {/* Main Body */}
        {currentView === 'order' ? (
          <div className="flex-1 w-full bg-[#faf9f6]">
            <CustomOrderPage onBack={() => navigateTo('home')} />
          </div>
        ) : (
          <main id="specialties" className="flex-1 w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-0">
            
            {/* Mobile Tab Switcher (< md) */}
            <div className="flex md:hidden items-center gap-1 p-1 bg-neutral-100 rounded-full border border-neutral-200/90 mb-5 select-none shadow-inner">
              <button
                onClick={() => setActiveArch(0)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeArch === 0
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Cookies
              </button>
              <button
                onClick={() => setActiveArch(1)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeArch === 1
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Artisan Bakery
              </button>
            </div>

            {/* Desktop Twin Arch Arcade (>= md) */}
            <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12 w-full max-w-5xl">
              {/* Arch 1: Cookies */}
              <div className="w-full max-w-[320px] lg:max-w-[360px] flex flex-col items-center animate-in fade-in duration-700">
                <div className="w-full relative p-2 sm:p-2.5 rounded-t-full border-[1.5px] border-neutral-900/85 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-500">
                  <div className="w-full p-1 sm:p-1.5 rounded-t-full border border-neutral-200/80 bg-neutral-50/50">
                    <div className="w-full aspect-[4/5] rounded-t-full overflow-hidden relative group bg-neutral-100 select-none">
                      <img
                        src="/hakuna-cookies.webp"
                        alt="Hakuna Potata Artisan Cookies"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center select-none">
                  <span className="text-xs tracking-[0.25em] uppercase font-bold text-neutral-400 font-display">
                    Handcrafted Cookies
                  </span>
                </div>
              </div>

              {/* Arch 2: Bakery */}
              <div className="w-full max-w-[320px] lg:max-w-[360px] flex flex-col items-center animate-in fade-in duration-700">
                <div className="w-full relative p-2 sm:p-2.5 rounded-t-full border-[1.5px] border-neutral-900/85 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-500">
                  <div className="w-full p-1 sm:p-1.5 rounded-t-full border border-neutral-200/80 bg-neutral-50/50">
                    <div className="w-full aspect-[4/5] rounded-t-full overflow-hidden relative group bg-neutral-100 select-none">
                      <img
                        src="/hakuna-bakery.webp"
                        alt="Hakuna Potata Artisan Viennoiserie"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="eager"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center select-none">
                  <span className="text-xs tracking-[0.25em] uppercase font-bold text-neutral-400 font-display">
                    Fresh Danishes &amp; Bakes
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Single Arch with Active State (< md) */}
            <div className="flex md:hidden w-full max-w-[280px] xs:max-w-[310px] sm:max-w-[340px] flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-full relative p-2 rounded-t-full border-[1.5px] border-neutral-900/85 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="w-full p-1 rounded-t-full border border-neutral-200/80 bg-neutral-50/50">
                  <div className="w-full aspect-[4/5] rounded-t-full overflow-hidden relative group bg-neutral-100 select-none">
                    <img
                      key={activeArch}
                      src={activeArch === 0 ? '/hakuna-cookies.webp' : '/hakuna-bakery.webp'}
                      alt={activeArch === 0 ? 'Hakuna Potata Cookies' : 'Hakuna Potata Bakery'}
                      className="w-full h-full object-cover object-center animate-in fade-in duration-500"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div className="mt-3.5 text-center select-none">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-400 font-display">
                  {activeArch === 0 ? 'Handcrafted Cookies' : 'Fresh Danishes & Bakes'}
                </span>
              </div>
            </div>

            {/* Handcrafted Cakes Grid Gallery */}
            <section id="cakes-gallery" className="w-full max-w-5xl mx-auto mt-14 sm:mt-20 mb-28 sm:mb-36 md:mb-44 px-2 sm:px-4">
              <div className="flex flex-col items-center text-center mb-7 sm:mb-10 select-none">
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 font-display">
                  Artisan Confections
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mt-1 font-display">
                  Signature Cakes
                </h2>
                <div className="w-8 h-[2px] bg-neutral-900 mt-2.5 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-7 lg:gap-10">
              {CAKES.map((cake, idx) => (
                <div
                  key={cake.id}
                  onClick={() => setSelectedCakeIndex(idx)}
                  className="group relative bg-transparent rounded-2xl cursor-pointer flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Pink Scalloped Best Selling Sticker Badge */}
                  {cake.isBestSeller && (
                    <div className="absolute -top-3 -right-2 z-20 select-none pointer-events-none drop-shadow-md animate-in zoom-in-75 duration-300 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                      <img
                        src="/badge-best-seller.webp"
                        alt="Best Selling Badge"
                        className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(244,63,94,0.4)]"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="relative z-10 text-[8px] sm:text-[9px] font-black tracking-tight uppercase text-white font-display text-center leading-[1.05] px-1 transform -rotate-6">
                        Best<br />Selling
                      </span>
                    </div>
                  )}

                  <div className="aspect-square w-full flex items-center justify-center bg-transparent">
                    <img
                      src={cake.src}
                      alt={`Hakuna Potata ${cake.name}`}
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)] group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="mt-2 text-xs font-semibold text-neutral-600 font-display group-hover:text-black transition-colors select-none">
                    {cake.name}
                  </span>
                </div>
              ))}
            </div>
            </section>

          </main>
        )}

        {/* Footer Wrapper with Bread Icons */}
        <div id="contact" className="relative w-full overflow-visible">
          {/* Bread icons on the right side, half clipped underneath navbar */}
          <div className="absolute right-6 sm:right-16 md:right-24 -top-[48px] sm:-top-[58px] md:-top-[82px] z-0 pointer-events-none select-none">
            <div className="relative w-32 sm:w-36 md:w-44">
              {/* Bread 1: Diagonally facing right (subtly dimmed) */}
              <img
                src="/bread-icon.webp"
                alt="Bread 1"
                className="w-full object-contain drop-shadow-sm opacity-85"
                loading="lazy"
                decoding="async"
                style={{
                  transform: 'rotate(-22deg)',
                }}
              />

              {/* Bread 2: Centre overlaps with Bread 1's right top part, facing opposite side */}
              <div
                className="absolute w-full"
                style={{
                  left: '78%',
                  top: 'calc(22% + 13px)',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <img
                  src="/bread-icon.webp"
                  alt="Bread 2"
                  className="w-full object-contain drop-shadow-md"
                  loading="lazy"
                  decoding="async"
                  style={{
                    transform: 'rotate(25deg)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Black Footer with rounded top-left and top-right edges */}
          <footer className="w-full bg-black text-white pt-7 sm:pt-8 pb-5 px-4 sm:px-12 rounded-t-[24px] sm:rounded-t-[36px] shadow-2xl relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col justify-between gap-6 sm:gap-8">
              
              {/* Main Footer Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
                
                {/* Left: HAKUNA POTATA with logo */}
                <div
                  className="flex items-center gap-2.5 sm:gap-3 select-none"
                >
                  <img
                    src="/logo.png"
                    alt="HAKUNA POTATA"
                    className="w-7 h-7 sm:w-10 sm:h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white font-display group-hover:text-neutral-300 transition-colors">
                    HAKUNA POTATA
                  </h2>
                </div>

                {/* Right: Vertical Bar + Contact details */}
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-4">
                  {/* Vertical bar on the left */}
                  <div className="w-[1px] h-12 sm:h-14 bg-neutral-800 rounded-full shrink-0 mt-0.5 sm:mt-0" />

                  {/* Contact section */}
                  <div className="flex flex-col gap-1 text-[10px] sm:text-[11px] leading-tight">
                    <h3 className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-neutral-400 font-display">
                      Contact
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <img
                        src="https://img.icons8.com/?size=100&id=BrwN1DLEiQeY&format=png&color=000000"
                        alt="Location"
                        className="w-2.5 h-2.5 object-contain shrink-0 opacity-80"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      <span className="break-words">Bashundhara R/A, F block 24, Bangladesh</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Mail className="w-2.5 h-2.5 shrink-0 opacity-80 text-neutral-300" />
                      <a
                        href="mailto:hakunapotatabakery@gmail.com"
                        className="hover:text-white transition-colors underline-offset-2 hover:underline text-neutral-300 font-medium"
                      >
                        hakunapotatabakery@gmail.com
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <img
                        src="https://img.icons8.com/?size=100&id=78382&format=png&color=000000"
                        alt="Phone"
                        className="w-2.5 h-2.5 object-contain shrink-0 opacity-80"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      <a href="tel:+8801339656675" className="hover:text-neutral-200 active:text-white transition-colors py-0.5">
                        +880 1339656675
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom centre in small size */}
              <div className="w-full pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] text-neutral-400 select-none">
                <div className="flex items-center gap-1.5 font-medium">
                  <img
                    src="https://img.icons8.com/?size=100&id=39295&format=png&color=000000"
                    alt="Cookie"
                    className="w-2.5 h-2.5 object-contain shrink-0 opacity-70"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span>cookies</span>
                  <span className="text-neutral-500">·</span>
                  <span>© 2026 HAKUNA POTATA</span>
                </div>

                <a
                  href="https://nonamedevs.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-neutral-400 font-mono text-[10px]"
                >
                  <span className="text-neutral-500 font-sans">made by</span>
                  <span className="underline decoration-neutral-700 underline-offset-2 hover:decoration-white font-semibold text-neutral-300">@nonamedevs</span>
                </a>
              </div>

            </div>
          </footer>
        </div>
      </div>

      {/* Cake Lightbox Modal */}
      {selectedCake && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedCakeIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar: Counter, Best Selling pill, and Close */}
            <div className="w-full flex items-center justify-between px-2 pb-2 sm:pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-white/15 text-white/90 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm tracking-wider font-display">
                  {(selectedCakeIndex ?? 0) + 1} / {CAKES.length}
                </span>
                {selectedCake.isBestSeller && (
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                    <img
                      src="/badge-best-seller.webp"
                      alt="Best Selling"
                      className="absolute inset-0 w-full h-full object-contain filter drop-shadow-sm"
                    />
                    <span className="relative z-10 text-[6.5px] sm:text-[7.5px] font-black tracking-tight uppercase text-white font-display text-center leading-[1.05] -rotate-6">
                      Best<br />Selling
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedCakeIndex(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm active:scale-95"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Stage + Navigation Arrows */}
            <div className="relative w-full flex items-center justify-center">
              {/* Previous Image Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevCake();
                }}
                className="absolute left-0 sm:left-2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/75 text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-xl backdrop-blur-md"
                title="Previous Cake (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Cake Image Display */}
              <div className="w-full flex items-center justify-center max-h-[68vh] sm:max-h-[74vh] px-10 sm:px-16 py-2">
                <img
                  key={selectedCake.id}
                  src={selectedCake.src}
                  alt={`Hakuna Potata ${selectedCake.name}`}
                  className="max-h-[66vh] sm:max-h-[72vh] w-auto max-w-full object-contain filter drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)] transition-all duration-300 animate-in fade-in zoom-in-95"
                />
              </div>

              {/* Next Image Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCake();
                }}
                className="absolute right-0 sm:right-2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/75 text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-xl backdrop-blur-md"
                title="Next Cake (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & Keyboard Hints */}
            <div className="w-full pt-3 px-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-white font-display border-t border-white/10 mt-2">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-sm sm:text-base tracking-wide">{selectedCake.name}</span>
                <span className="text-white/50 tracking-wider uppercase text-[10px]">· Hakuna Potata Artisan Bakery</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span className="hidden sm:inline">Use arrow keys ← → to browse</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
