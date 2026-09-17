import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { CakeSizeReference } from './components/CakeSizeReference';
import type { CakeOptionInfo } from './data/cakeSizes';
import { SINGLE_TIER_SIZES } from './data/cakeSizes';
import { AudioPlayer } from './components/AudioPlayer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { WatermarkPill } from './components/WatermarkPill';
import { ShoppingBag, ArrowLeft, Layers } from 'lucide-react';

export const OrderApp = () => {
  const [selectedOption, setSelectedOption] = useState<CakeOptionInfo>(SINGLE_TIER_SIZES[1]); // Default 6"

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const isTower = selectedOption.category === 'tower';

  const getInquiryUrl = () => {
    const text = isTower
      ? `Hello Hakuna Potata! I would like to inquire about ordering the ${selectedOption.name} (${selectedOption.topTierInches}″ on ${selectedOption.bottomTierInches}″ two-layer tower) for ${selectedOption.servings}.`
      : `Hello Hakuna Potata! I would like to inquire about ordering a custom ${selectedOption.inches}″ cake (${selectedOption.name}) for ${selectedOption.servings}.`;
    return `https://wa.me/8801339656675?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 selection:bg-neutral-200 flex flex-col justify-between">
      {/* Background Ambience & Audio */}
      <AudioPlayer />
      <WhatsAppButton />
      <WatermarkPill />

      <div>
        {/* Navigation Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bakery Menu</span>
          </button>

          {/* Center Brand */}
          <a
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="Hakuna Potata"
              className="w-6 h-6 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 font-display">
              HAKUNA POTATA
            </span>
          </a>

          {/* Right Action / Studio Label */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-display hidden sm:inline">
              Custom Order Studio
            </span>
            <div className="w-16 sm:w-24 shrink-0" />
          </div>
        </header>

        {/* Main Content: Size & Tower Reference Guide */}
        <main className="w-full">
          <CakeSizeReference
            selectedSizeId={selectedOption.id}
            onSelectSize={(item) => setSelectedOption(item)}
          />

          {/* Selected Option Summary Banner */}
          <div className="max-w-4xl mx-auto px-4 pb-16">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 rounded-2xl bg-[#faf9f6] border border-neutral-100 flex items-center justify-center p-2 shrink-0">
                  <img
                    src={selectedOption.imageSrc}
                    alt={selectedOption.name}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                      {isTower ? '2-Layer Tower' : 'Single Tier'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {selectedOption.diameterSpec}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-display">
                    {selectedOption.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {selectedOption.servings} ({selectedOption.sliceCount}) · {selectedOption.standardHeight}
                  </p>
                  {isTower && (
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-800 font-medium">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>{selectedOption.topTierInches}″ top tier stacked over {selectedOption.bottomTierInches}″ base tier</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={getInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider font-display px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order {isTower ? 'Tower' : `${selectedOption.inches}″ Cake`}</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Minimal Footer */}
      <footer className="w-full bg-white border-t border-neutral-200/70 py-6 px-4 text-center select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 font-display">HAKUNA POTATA</span>
            <span>·</span>
            <span>Artisan Bakery &amp; Custom Studio</span>
          </div>
          <div className="text-[11px] font-mono">
            Single Tiers (4″, 6″, 8″, 10″) &amp; 2-Layer Towers (4″/6″, 6″/8″, 8″/10″)
          </div>
          <div className="text-[11px]">
            © 2026 HAKUNA POTATA
          </div>
        </div>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrderApp />
  </StrictMode>,
);
