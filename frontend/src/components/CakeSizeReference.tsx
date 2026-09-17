import React, { useState } from 'react';
import { Users, Ruler, Sparkles, Check, ArrowRight, Layers } from 'lucide-react';
import type { CakeOptionInfo, TierCategory } from '../data/cakeSizes';
import { SINGLE_TIER_SIZES, TOWER_TIER_SIZES, ALL_CAKE_OPTIONS } from '../data/cakeSizes';

export type { CakeOptionInfo };

interface CakeSizeReferenceProps {
  onSelectSize?: (size: CakeOptionInfo) => void;
  selectedSizeId?: string;
}

export const CakeSizeReference: React.FC<CakeSizeReferenceProps> = ({
  onSelectSize,
  selectedSizeId = '6',
}) => {
  const [activeCategory, setActiveCategory] = useState<TierCategory>(
    selectedSizeId.startsWith('tower') ? 'tower' : 'single'
  );
  const [selectedId, setSelectedId] = useState<string>(selectedSizeId);
  const [viewMode, setViewMode] = useState<'lineup' | 'focus'>('lineup');

  const currentOptions = activeCategory === 'single' ? SINGLE_TIER_SIZES : TOWER_TIER_SIZES;
  const selectedItem =
    ALL_CAKE_OPTIONS.find((s) => s.id === selectedId) || currentOptions[0];

  const handleSelect = (item: CakeOptionInfo) => {
    setSelectedId(item.id);
    setActiveCategory(item.category);
    onSelectSize?.(item);
  };

  const handleCategorySwitch = (category: TierCategory) => {
    setActiveCategory(category);
    const targetList = category === 'single' ? SINGLE_TIER_SIZES : TOWER_TIER_SIZES;
    if (!targetList.some((item) => item.id === selectedId)) {
      setSelectedId(targetList[0].id);
      onSelectSize?.(targetList[0]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold tracking-widest uppercase text-neutral-600 mb-3 font-display">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Size &amp; Architectural Guide</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 font-display">
          Single Tiers &amp; Two-Layer Towers
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
          Explore our handcrafted cake silhouettes. Choose between clean single tiers (4″, 6″, 8″, 10″) or our grand two-layer celebration towers.
        </p>

        {/* Category Selector Tabs (Single Tier vs Towers) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => handleCategorySwitch('single')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer font-display shadow-sm ${
              activeCategory === 'single'
                ? 'bg-black text-white scale-105 shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <span>Single Tier Cakes (4″ – 10″)</span>
          </button>
          <button
            onClick={() => handleCategorySwitch('tower')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer font-display shadow-sm ${
              activeCategory === 'tower'
                ? 'bg-black text-white scale-105 shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Two-Layer Towers (Stacked)</span>
          </button>
        </div>

        {/* View Mode Toggle (Lineup vs Focus) */}
        <div className="mt-4 inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200">
          <button
            onClick={() => setViewMode('lineup')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              viewMode === 'lineup'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Side-by-Side Lineup
          </button>
          <button
            onClick={() => setViewMode('focus')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              viewMode === 'focus'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Interactive Focus View
          </button>
        </div>
      </div>

      {/* Main Visual Lineup / Focus Stage */}
      {viewMode === 'lineup' ? (
        <div className="w-full bg-white rounded-3xl border border-neutral-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10 mb-8 select-none">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-8 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 font-display block">
                {activeCategory === 'single'
                  ? 'Standard Single-Tier Diameters'
                  : 'Two-Layer Architectural Towers (Top on Base)'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-800 font-display">
                {activeCategory === 'single'
                  ? '4″, 6″, 8″ and 10″ Proportions'
                  : '4″ on 6″, 6″ on 8″, and 8″ on 10″ Combinations'}
              </h3>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              {activeCategory === 'single' ? '4 Single Sizes' : '3 Tower Configurations'}
            </div>
          </div>

          {/* Lineup Stage */}
          <div className="relative w-full pt-4 pb-8 flex flex-col justify-end">
            <div
              className={`grid gap-6 sm:gap-8 items-end justify-items-center ${
                activeCategory === 'single'
                  ? 'grid-cols-2 md:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-3'
              }`}
            >
              {currentOptions.map((item) => {
                const isSelected = item.id === selectedId;
                const baseMaxWidth =
                  item.category === 'single'
                    ? item.inches === 4
                      ? '110px'
                      : item.inches === 6
                      ? '155px'
                      : item.inches === 8
                      ? '205px'
                      : '260px'
                    : item.id === 'tower-4-6'
                    ? '190px'
                    : item.id === 'tower-6-8'
                    ? '230px'
                    : '275px';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`group w-full flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Badge */}
                    <div className="h-6 flex items-center justify-center mb-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-black'
                        }`}
                      >
                        {item.badge || (item.category === 'tower' ? 'Tower' : 'Single Tier')}
                      </span>
                    </div>

                    {/* Cylinder / Tower Graphic */}
                    <div
                      className={`relative flex flex-col items-center justify-end w-full ${
                        item.category === 'tower'
                          ? 'h-[230px] sm:h-[280px]'
                          : 'h-[180px] sm:h-[220px]'
                      }`}
                    >
                      <div
                        className="relative transition-transform duration-300 flex items-center justify-center"
                        style={{ width: baseMaxWidth, maxWidth: '100%' }}
                      >
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className={`w-full object-contain filter drop-shadow-[0_12px_24px_rgba(37,99,235,0.18)] transition-transform duration-300 ${
                            isSelected ? 'scale-105' : 'group-hover:scale-102'
                          }`}
                        />

                        {/* Dimension tag overlay */}
                        <div className="absolute -top-3 sm:-top-4 bg-white/95 backdrop-blur-sm border border-neutral-200 text-[10px] sm:text-xs font-bold font-mono px-2.5 py-0.5 rounded-full shadow-sm text-neutral-800 text-center">
                          {item.category === 'single'
                            ? `${item.inches}″ Round`
                            : `${item.topTierInches}″ on ${item.bottomTierInches}″`}
                        </div>
                      </div>
                    </div>

                    {/* Pedestal line */}
                    <div
                      className={`h-1 rounded-full transition-all mt-3 ${
                        isSelected
                          ? 'w-24 bg-black'
                          : 'w-12 bg-neutral-200 group-hover:bg-neutral-400'
                      }`}
                    />

                    {/* Info below */}
                    <div className="mt-4 text-center">
                      <div className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                        {item.name}
                      </div>
                      <div className="text-xs font-medium text-neutral-500 mt-0.5">
                        {item.servings}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {item.standardHeight}
                      </div>
                      <div className="mt-2.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full transition-all ${
                            isSelected
                              ? 'bg-neutral-900 text-white shadow-sm'
                              : 'text-neutral-600 bg-neutral-100 group-hover:bg-neutral-200'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Focus Interactive Stage */
        <div className="w-full bg-white rounded-3xl border border-neutral-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center select-none">
          {/* Left: Graphic Spotlight */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-[#faf9f6] rounded-2xl border border-neutral-100 relative min-h-[340px] sm:min-h-[440px]">
            {/* Spec Tag */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 text-[11px] text-neutral-500 font-mono">
              <span className="font-bold text-neutral-800">
                {selectedItem.category === 'tower' ? '2-LAYER TOWER' : 'SINGLE TIER'}
              </span>
              <span>{selectedItem.diameterSpec}</span>
              <span>Height: {selectedItem.standardHeight}</span>
            </div>

            <div className="w-full flex items-center justify-center py-6">
              <div
                className="transition-all duration-500 ease-out flex items-center justify-center relative"
                style={{
                  width: `${Math.round(selectedItem.relativeScale * 300)}px`,
                  maxWidth: '92%',
                }}
              >
                <img
                  src={selectedItem.imageSrc}
                  alt={selectedItem.name}
                  className="w-full object-contain filter drop-shadow-[0_20px_35px_rgba(37,99,235,0.22)]"
                />
              </div>
            </div>

            <div className="text-center mt-2">
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-400 font-display">
                {selectedItem.tiers} · Freshly Baked To Order
              </span>
            </div>
          </div>

          {/* Right: Selected Item Specs */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {selectedItem.badge || selectedItem.tiers}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {selectedItem.category === 'tower' ? 'Tiered Tower' : 'Single Tier'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-display">
                {selectedItem.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {/* Spec Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Users className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Portions</span>
                </div>
                <div className="text-sm font-bold text-neutral-800 font-display">
                  {selectedItem.servings}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {selectedItem.sliceCount}
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Ruler className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Dimensions</span>
                </div>
                <div className="text-sm font-bold text-neutral-800 font-display">
                  {selectedItem.category === 'tower'
                    ? `${selectedItem.topTierInches}″ on ${selectedItem.bottomTierInches}″`
                    : `⌀ ${selectedItem.inches}″ Round`}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {selectedItem.standardHeight}
                </div>
              </div>
            </div>

            {/* Breakdown for Towers */}
            {selectedItem.category === 'tower' && (
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">Top Tier</span>
                  <span className="font-bold text-neutral-800">{selectedItem.topTierInches}″ Round</span>
                </div>
                <div className="text-neutral-300 font-bold">+</div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">Base Tier</span>
                  <span className="font-bold text-neutral-800">{selectedItem.bottomTierInches}″ Round</span>
                </div>
                <div className="text-neutral-300 font-bold">=</div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">Total Servings</span>
                  <span className="font-bold text-neutral-900">{selectedItem.servings}</span>
                </div>
              </div>
            )}

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Ideal Occasion
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                {selectedItem.idealFor}
              </p>
            </div>

            {/* Switcher Buttons */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-display">
                Select Option
              </span>
              <div className="flex flex-wrap gap-2">
                {currentOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center font-display ${
                      item.id === selectedId
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {item.category === 'single'
                      ? `${item.inches}″`
                      : `${item.topTierInches}″ / ${item.bottomTierInches}″`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid for Current Category */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          activeCategory === 'single'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
        {currentOptions.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                isSelected
                  ? 'bg-black text-white border-black shadow-xl scale-[1.02]'
                  : 'bg-white text-neutral-900 border-neutral-200/80 hover:border-neutral-400 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge || item.tiers}
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-400'
                    }`}
                  >
                    {item.category === 'single' ? `⌀ ${item.inches}″` : '2 Tiers'}
                  </span>
                </div>

                <div className="text-xl font-bold font-display tracking-tight">
                  {item.name}
                </div>
                <div
                  className={`text-xs mt-1 font-medium ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {item.servings}
                </div>

                <div
                  className={`my-4 h-px ${
                    isSelected ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                />

                <p
                  className={`text-xs leading-relaxed ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  {item.idealFor}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3">
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Chosen</span>
                    </>
                  ) : (
                    <>
                      <span>Choose</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-neutral-400' : 'text-neutral-400'
                  }`}
                >
                  {item.standardHeight}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
